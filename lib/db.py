from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv(".env.local")


class MongoDB:
    _instance = None

    @classmethod
    def get_mongo_client(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        print("MONGODB_ATLAS_URI: ", os.environ.get("MONGODB_ATLAS_URI"))
        uri = os.environ.get("MONGODB_ATLAS_URI")
        self._instance = MongoClient(
            uri,
            appname="devrel.content.vercel",
        )["Demo"]

    def get_collection(self, collection_name):
        return self._instance[collection_name]
