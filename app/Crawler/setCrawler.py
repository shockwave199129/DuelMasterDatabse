# import from 'app'
from app.Database.db import Base, engine, Session
from app.Database.models import Card, Category, CrawlerTask, DMSets
import sqlalchemy
from sqlalchemy import distinct
import logging
import requests
from bs4 import BeautifulSoup
import json
import os
import sys
from datetime import datetime
import traceback
sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            '..',
            '..')))


def run_set_crawler() -> None:

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)

    file_handler = logging.FileHandler('log/crawler_log_file.log')
    formatter = logging.Formatter(
        '%(levelname)s - %(asctime)s - %(name)s - %(message)s')
    file_handler.setFormatter(formatter)

    logger.addHandler(file_handler)

    logger.info('='*100)
    logger.info('Set crawler task request recived')

    BASEURL = 'https://duelmasters.fandom.com'

    db = Session()

    # Check if there are any entries with status "running"
    existing_task = db.query(CrawlerTask).filter_by(status='running').first()
    if existing_task:
        logger.info('A set crawler task is already running. Exiting.')
        return

    newTask = CrawlerTask()
    newTask.task_name = "set Crawler"
    newTask.status = "running"
    newTask.massage = ""
    newTask.start_at = datetime.now()

    db.add(newTask)
    db.commit()

    task_id = newTask.id

    logger.info('Set crawler task started with task id '+ str(task_id))

    try:
        # Send a GET request to the web page
        url = 'https://duelmasters.fandom.com/wiki/List_of_Duel_Masters_OCG_Sets'
        response = requests.get(url)

        # Parse the HTML content using Beautiful Soup
        soup = BeautifulSoup(response.content, 'html.parser')

        div_mw_parser_output = soup.find('div', {'class': 'mw-parser-output'})

        uls = div_mw_parser_output.find_all('ul')

        li_list = []

        for ul in uls[1:-2]:
            li_list.extend([
                li for li in ul.find_all('li', recursive=False)
                if not li.has_attr('class')
            ])

        # Find all a tags and extract the links from them
        set_links = {}
        for li in li_list:
            link = li.find('a')
            link_text = li.find('b', recursive=False).text if li.find('b', recursive=False) is not None else ''
            if link is not None:
                set_links[link_text+link.text] = BASEURL + link.get('href')

        # Print the links
        for set_name, set_link in set_links.items():

            response = requests.get(set_link)
            soup = BeautifulSoup(response.content, 'html.parser')

            div_mw_parser_output = soup.find(
                'div', {'class': 'mw-parser-output'})

            # Find the h2 element with the Contents ID
            h2s = div_mw_parser_output.find_all('h2')

            contents_h2 = None
            end_h2 = None

            for i in range(len(h2s)):
                if h2s[i].find('span', {'id': 'Contents'}) or h2s[i].find('span', {
                        'id': 'New_Cards'}) or h2s[i].find('span', {'id': 'List_of_Promotional_cards'}):
                    contents_h2 = h2s[i]
                    end_h2 = h2s[i + 1] if i + 1 < len(h2s) else None

            set_li_list = []

            if contents_h2 is not None:
                # Find all the ul tags after the contents_h2 element
                set_uls = contents_h2.find_next_siblings('ul')

                for ul in set_uls:
                    set_li_list.extend([
                        li for li in ul.find_all('li', recursive=False)
                        if not li.has_attr('class')
                    ])

            rm_li_list = []

            if end_h2 is not None:
                # last removable part
                rm_set_uls = end_h2.find_next_siblings('ul')

                for ul in rm_set_uls:
                    rm_li_list.extend([
                        li for li in ul.find_all('li', recursive=False)
                        if not li.has_attr('class')
                    ])

            final_set_li_list = list(
                set(set_li_list).difference(
                    set(rm_li_list)))

            for set_li in final_set_li_list:
                link = set_li.find('a')
                if link is not None:

                    existing_set = db.query(DMSets).filter_by(
                        set=set_name, set_link=set_link, card_link=BASEURL + link.get('href')).first()

                    if existing_set is None:

                        dm_set = DMSets(
                            set=set_name,
                            set_link=set_link,
                            card_link=BASEURL + link.get('href'))
                        db.add(dm_set)
                        db.commit()

        task = db.query(CrawlerTask).filter(CrawlerTask.id == task_id).one()
        logger.info('Done saving all card link as set with task id '+ str(task_id))

        cardLink: list = db.query(
            distinct(
                DMSets.card_link)).order_by(
            DMSets.card_link.asc()).all()

        for card in cardLink:

            while True:
                try:
                    response = requests.get(''.join((card)))
                    #response.raise_for_status()
                    if (response.status_code ==  200) or (400 <= response.status_code < 600):
                        break
                except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
                    logger.info(f"retrying to get connection for link {''.join((card))} task id {str(task_id)}")

            card_data = {}
            category_data = {}

            if response.status_code == 200:
                # Parse the HTML content using Beautiful Soup
                soup = BeautifulSoup(response.content, 'html.parser')

                table = soup.find('table', {'class': 'wikitable'})

                if table is not None:

                    field_map = {
                        'name': set(),
                        'image': set(),
                        'civilization': set(),
                        'cardtype': set(),
                        'manacost': set(),
                        'race': set(),
                        'power': set(),
                        'englishtext': set(),
                        'subtype': set(),
                        'mananumber': set()
                    }

                    rows = table.select_one('tbody').find_all(
                        'tr', recursive=False)
                    for row in rows:
                        head = row.select_one('th')
                        if head is not None and not (head.select_one(
                                'div > a') or head.select_one('div > b')):
                            field_map['name'].add(head.text.strip())

                        cell = row.find_all('td', recursive=False)

                        if len(cell) == 1 and cell[0].select_one('div.center'):
                            field_map['image'].add(
                                cell[0].select_one('div.center div.floatnone a img').get('src'))

                        if len(cell) == 1 and not (cell[0].find(
                                'small', recursive=False) or cell[0].find('center', recursive=False)) and (
                                cell[0].find('div', recursive=False)):
                            field_map['name'].add(cell[0].find('div', recursive=False).text.strip())

                        if len(cell) == 2:
                            field = cell[0].text.strip(
                            )[:-1].replace(' ', '').lower()
                            if field == 'englishtext':
                                value = cell[1].text.strip()
                            else:
                                value = cell[1].text.strip().split('/')

                            if field.startswith('civilization'):
                                for item in value:
                                    field_map['civilization'].add(item.strip())
                            elif field.startswith('cardtype'):
                                for item in value:
                                    field_map['cardtype'].add(item.strip())
                            elif field.startswith('manacost'):
                                for item in value:
                                    field_map['manacost'].add(item.strip())
                            elif field.startswith('race'):
                                for item in value:
                                    field_map['race'].add(item.strip())
                            elif field.startswith('power'):
                                for item in value:
                                    field_map['power'].add(item.strip())
                            elif field.startswith('subtype'):
                                for item in value:
                                    field_map['subtype'].add(item.strip())
                            elif field.startswith('mananumber'):
                                for item in value:
                                    field_map['mananumber'].add(item.strip())
                            elif field == 'englishtext':
                                field_map['englishtext'].add(value)

                                if cell[1].find_next_siblings('table', limit=1):
                                    field_map['englishtext'].add(
                                        cell[1].select_one('table > tr > td').text)
                                    
                    field_map['name'].discard('')
                    card_data = {
                        'name': '/ '.join(field_map['name']),
                        'image': '/ '.join(field_map['image']),
                        'civilization': '/'.join(field_map['civilization']),
                        'cardtype': '/'.join(field_map['cardtype']),
                        'manacost': '/'.join(field_map['manacost']),
                        'race': json.dumps(list(field_map['race'])),
                        'power': '; '.join(field_map['power']),
                        'englishtext': '/n '.join(field_map['englishtext']),
                        'subtype': '/ '.join(field_map['subtype']),
                        'mananumber': '/ '.join(field_map['mananumber']),
                        'link': ''.join(card)
                    }

                    existing_card = db.query(Card).filter_by(
                        name=card_data['name'], link=(''.join(card))).first()
                    if existing_card is None:
                        newCardData = Card(
                            name=card_data['name'],
                            image=card_data['image'],
                            civilization=card_data['civilization'],
                            cardtype=card_data['cardtype'],
                            manacost=card_data['manacost'],
                            race=card_data['race'],
                            power=card_data['power'],
                            englishtext=card_data['englishtext'],
                            subtype=card_data['subtype'],
                            mananumber=card_data['mananumber'] if len(card_data['mananumber']) > 0 else 0,
                            link=card_data['link'])

                        db.add(newCardData)
                        try:
                            db.commit()
                        except sqlalchemy.exc.OperationalError as e:
                            raise e
                    else:
                        existing_card.name=card_data['name']
                        existing_card.image=card_data['image']
                        existing_card.civilization=card_data['civilization']
                        existing_card.cardtype=card_data['cardtype']
                        existing_card.manacost=card_data['manacost']
                        existing_card.race=card_data['race']
                        existing_card.power=card_data['power']
                        existing_card.englishtext=card_data['englishtext']
                        existing_card.subtype=card_data['subtype']
                        existing_card.mananumber=card_data['mananumber'] if len(card_data['mananumber']) > 0 else 0
                        existing_card.link=card_data['link']
                        try:
                            db.commit()
                        except sqlalchemy.exc.OperationalError as e:
                            raise e

                    footer = soup.find('div', {'class': 'page-footer'})

                    if footer is not None:

                        cat_map = {
                            'categories': set()
                        }

                        rows = footer.select_one('nav').find_all(
                            'li', {'class': 'category'})

                        for row in rows:
                            cat_map['categories'].add(row.text.strip())

                        category_data = {
                            'categories': json.dumps(list(cat_map['categories'] - field_map['race'])),
                            'link': ''.join(card)
                        }

                        existing_category = db.query(Category).filter_by(
                            link=category_data['link']).first()

                        if existing_category is None:
                            newCategoryData = Category(
                                categories=category_data['categories'],
                                link=category_data['link'])

                            db.add(newCategoryData)
                            try:
                                db.commit()
                            except sqlalchemy.exc.OperationalError as e:
                                raise e
                        else:
                            existing_category.categories=category_data['categories'],
                            existing_category.link=category_data['link']
                            try:
                                db.commit()
                            except sqlalchemy.exc.OperationalError as e:
                                raise e

        # Update the task's properties
        task.status = "completed"
        task.massage = "Set crawling completed successfully"
        task.end_at = datetime.now()

        # Commit the changes to the database
        db.commit()
        logger.info('Set crawler task completed with task id '+ str(task_id))
    except Exception as e:

        task = db.query(CrawlerTask).filter(CrawlerTask.id == task_id).one()
        # Update the task's properties
        task.status = "error"
        task.massage = str(e)
        task.end_at = datetime.now()

        # Commit the changes to the database
        db.commit()
        logger.info(f"Set crawler task with task id {task_id} ended with error {str(e)}")
        logger.info(traceback.format_exc())
        if __name__ == "__main__":
            raise e


if __name__ == "__main__":
    run_set_crawler()
