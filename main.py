from fastapi import FastAPI, Depends
from pydantic import BaseModel
import requests
import json
from typing import List

app = FastAPI()

# Define a model for the product data
class Product(BaseModel):
    id: int
    product_name: str
    price: float
    store: str
    url: str

# Amazon API details (you need to set these up yourself)
AMAZON_API_ENDPOINT = "https://api.amazon.com/product/advertising"
AMAZON_ACCESS_KEY = "YOUR_ACCESS_KEY"
AMAZON_SECRET_KEY = "YOUR_SECRET_KEY"
AMAZON_ASSOCIATE_TAG = "YOUR_ASSOCIATE_TAG"

# Function to fetch products from Amazon API
def get_amazon_products(query: str):
    # Construct the API URL with the search query
    amazon_url = f"{AMAZON_API_ENDPOINT}?keywords={query}&access_key={AMAZON_ACCESS_KEY}&associate_tag={AMAZON_ASSOCIATE_TAG}"

    # Call the Amazon API (assuming the response is JSON)
    response = requests.get(amazon_url)
    if response.status_code == 200:
        data = response.json()
        return data['products']  # Assuming the Amazon API returns products in a 'products' list
    else:
        return []

# FastAPI route for searching products
@app.get("/search", response_model=List[Product])
def search_products(query: str):
    products = get_amazon_products(query)
    product_list = []
    
    # Convert the response to a list of products (you can adjust the mapping based on actual API response)
    for idx, product in enumerate(products):
        product_data = {
            'id': idx,
            'product_name': product['title'],
            'price': product['price'],
            'store': "Amazon",
            'url': product['url']
        }
        product_list.append(product_data)

    return {"results": product_list}
