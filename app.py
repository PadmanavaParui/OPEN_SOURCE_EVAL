# Step 1: Import all the libraries
from flask import Flask, jsonify
import requests
import pandas as pd
from flask_cors import CORS

# Step 2: Create the Flask app and allow CORS
app = Flask(__name__)
CORS(app)

# Step 3: Upgrade the data-getting function
# It now takes a 'country_code' argument (like "IND", "USA", "CHN")
def get_gdp_data(country_code):
    
    # --- THIS IS THE MAIN CHANGE ---
    # We use an f-string to build the URL with the new country_code
    api_url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/NY.GDP.MKTP.CD?date=2012:2022&format=json"

    print(f"Fetching data for {country_code} from World Bank API...")
    
    try:
        response = requests.get(api_url)
        data = response.json()
        
        data_list = data[1]
        df = pd.DataFrame(data_list)

        # Clean the table
        clean_df = df[['date', 'value']]
        clean_df = clean_df.rename(columns={"value": "gdp"})
        
        data_json = clean_df.to_dict('records')
        
        return data_json

    except Exception as e:
        # If a country's data is missing, the API returns an error.
        # We'll catch it and return an empty list.
        print(f"Error fetching data for {country_code}: {e}")
        return [] # Return empty data instead of crashing

# Step 4: Define our routes
@app.route("/")
def home():
    return "Hello! My Flask server is running and ready to serve data for any country."

# --- THIS IS THE MAIN CHANGE ---
# The route is now "dynamic". The <country_code> part is a variable
# that gets passed to our function.
@app.route("/api/gdp/<country_code>")
def api_gdp_data(country_code):
    print(f"API request received for {country_code}...")
    
    # 1. Call our function with the specific country_code
    data = get_gdp_data(country_code)
    
    # 2. Send the data back
    return jsonify(data)

# Step 5: Run the app
if __name__ == "__main__":
    app.run(debug=True)