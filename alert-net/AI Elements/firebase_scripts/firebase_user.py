import csv
import firebase_admin
from firebase_admin import credentials, firestore


cred = credentials.Certificate(
    "alertnet-12de6-firebase-adminsdk-fbsvc-dcb6fb3901.json")
firebase_admin.initialize_app(cred)


def add_data_to_firestore(doc_id, collection_name, data):
    db = firestore.client()
    collection_ref = db.collection(collection_name)

    doc_ref = collection_ref.document(doc_id)
    doc_ref.set(data)


collection_name = 'users'

data = []
with open("users.csv", 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        id = row['user_id']
        del row['user_id']
        add_data_to_firestore(id, collection_name, dict(row))
