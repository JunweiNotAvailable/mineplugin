from pymongo import MongoClient
import os
import json

client = MongoClient(host=os.environ.get("ATLAS_URI"))

def lambda_handler(event, context): 

  # Get id from parameters
  params = event.get('queryStringParameters', {})
  item_id = params.get('id', '')
  database_name = params.get('database', '')
  collection_name = params.get('collection', '')
  key = params.get('key', '')

  # Connect to MongoDB
  database = client[database_name]
  collection = database[collection_name]

  try:
    # Retrieve the item based on the identifier
    result = collection.find_one({[key]: item_id})

    if result:
      return {
        'statusCode': 200,
        'body': json.dumps(result)
      }
    return {
      'statusCode': 404,
      'body': json.dumps({'message': 'Item not found'})
    }

  except Exception as e:
    # Return error
    return {
      'statusCode': 400,
      'body': json.dumps('Invalid request or error in processing: ' + e)
    }
  
  
  
  
  
  
  