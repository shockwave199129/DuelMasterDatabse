import fitz
from googletrans import Translator
from requests.exceptions import RequestException
import time
import re

pdf_path = 'dm_rule_20230421.pdf'

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(9, doc.page_count):
        page = doc[page_num]
        text += page.get_text()
    doc.close()
    return text

def translate_text(text, target_lang='en', max_retries=3):

    translator = Translator(service_urls=['translate.google.com'], 
                            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                            raise_exception=True)

    retries = 0
    while retries < max_retries:
        try:
            translation = translator.translate_legacy(text, dest=target_lang)
            return translation.text
        except RequestException as e:
            print("Translation request failed. Retrying...")
            retries += 1
            time.sleep(2)  # Wait for a moment before retrying

    return None

#pdf_text = extract_text_from_pdf(pdf_path)
#translated_text = translate_text(pdf_text)
#print(pdf_text)

with open('dm_rule.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()

# Initialize an empty list to store dictionaries
result_list = []
# Initialize variables to hold values
current_head = None
current_section = None
current_content = None

# Regular expression patterns
head_pattern = re.compile(r'^(\d{1})\.\s+(.*)$')
section_pattern = re.compile(r'^(\d{3})\.\s+(.*)$') #re.compile(r'^(\d+\.\d+[a-z]*)\.\s+(.*)$')
content_pattern = re.compile(r'^(\d{3}\.\d{1,}[a-z]*)(.|\s)(.*)$')

# Iterate through each line in the file
for line in lines:
    line = line.strip()  # Remove leading/trailing whitespace

    match_head = head_pattern.match(line)
    match_section = section_pattern.match(line)
    match_content = content_pattern.match(line)

    if match_head:
        current_head = match_head.group(2)
        current_section = None
        current_content = None
    elif match_section:
        current_section = match_section.group(2)
        current_content = None
    elif match_content:
        current_content = match_content.group(3)
        if current_section and current_head:  # Make sure section and head are defined
        # Create a dictionary and add it to the result list
            result_list.append({
                'head': current_head,
                'section': current_section,
                'content': current_content
            })
    elif (len(line) > 0) and (not line[0].isdigit()):
        # This is a continuation line, append to current_content
        if result_list[-1]['content'] is not None:
            result_list[-1]['content'] += " " + line

    

# Print the list of dictionaries
print(result_list)
