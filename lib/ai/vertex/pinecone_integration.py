import os
import sys
import json
import requests
import re
from PIL import Image
from io import BytesIO
from pinecone import Pinecone
#from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec


# Initialize Pinecone
pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")  # Load API key from environment variables
)


def read_ids_from_file(board_slug):
    try:
        file_path = "C:\\Users\\Vishwajeet Ghosh\\Desktop\\rt\\lib\\pinterest\\mockPinterestData.json"
        with open(file_path, "r") as file:
            # Read and parse the JSON file
            json_data = json.load(file)
            
            # Extract IDs only from the board_slug category
            ids = []
            if board_slug in json_data:
                pins = json_data[board_slug]
                ids.extend([pin["id"] for pin in pins])
            else:
                print(f"Category '{board_slug}' not found in the JSON data.", file=sys.stderr)
            
        return ids
    except Exception as e:
        print(f"Error reading file: {e}", file=sys.stderr)
        return []

def getExistingVectorIds(board_slug):
    try:
        newVectors = []  # Initialize newVectors as an empty list
        existindIds = []  # Initialize existingIds as an empty list

        # Fetch all vectors from the index
        for ids in read_ids_from_file(board_slug):
            response = index.fetch(ids=[ids])

            if not response.vectors:
                newVectors.append(ids)  # Add to newVectors if not found
            else:
                existindIds.append(ids)  # Add to existindIds if found

        # Return only the new vectors
        return newVectors
    except Exception as e:
        print(f"Error fetching existing vector IDs: {e}", file=sys.stderr)
        return []

if __name__ == "__main__":
    import json

    # Get the boardSlug from the command-line arguments
    if len(sys.argv) < 2:
        print("Error: Missing boardSlug argument", file=sys.stderr)
        sys.exit(1)

    board_slug = sys.argv[1]
    INDEX_NAME = board_slug

    # Ensure the index exists
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=35,  # Replace with the correct dimension of your vectors
            metric="euclidean",
            spec=ServerlessSpec(
                cloud="aws",  # Replace with your cloud provider
                region="us-east-1"  # Replace with your region
            )
        )

    # Connect to the index
    index = pc.Index(INDEX_NAME)

    # Fetch new vectors
    new_vectors = getExistingVectorIds(board_slug)
    print(json.dumps(new_vectors))  # Output the result as JSON

