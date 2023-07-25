import uvicorn
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from threading import Thread


from .Database.db import Base, engine
from .Crawler.setCrawler import run_set_crawler
from .Routes import cardSearch, webSearch, userLogin

app = FastAPI()
#background_task = BackgroundTasks()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# run crawler
scheduler = BackgroundScheduler()
scheduler.add_job(run_set_crawler, CronTrigger(day='1', hour='0', minute='0'))
scheduler.start()

@app.get("/")
async def read_root():
    return {"Hello": "World"}


""" @app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q} """

app.include_router(cardSearch.router, tags=['Swagger Search'])
app.include_router(webSearch.router, tags=['Web Search'])
app.include_router(userLogin.router, tags=['User'])

@app.get("/run-task/", tags=["for backend"])
async def run_task(background_task: BackgroundTasks):
    def run_task_in_background():
        # Run the background task
        run_set_crawler()
    
    # Start the task in a new thread
    thread = Thread(target=run_task_in_background)
    thread.start()
    return {"message": "Background task added to the scheduler"}



if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
