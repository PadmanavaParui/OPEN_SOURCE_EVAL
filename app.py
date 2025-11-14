# # Step 1: Import the Flask library
# from flask import Flask

# # Step 2: Create a Flask "app" instance
# # This 'app' is your entire web server.
# app = Flask(__name__)

# # Step 3: Define a "route"
# # A route is a URL for your server.
# # This '@' line tells Flask: "When someone visits the main URL ('/')..."
# @app.route("/")
# def home():
#     # "...run this 'home' function and send back whatever it returns."
#     return "Hello, World! My Flask server is running!"

# # Step 4: Run the app
# # This 'if' statement is standard Python. It means:
# # "Only run the server if this script is executed directly."
# if __name__ == "__main__":
#     # This starts your server.
#     # 'debug=True' is very helpful. It automatically restarts
#     # your server every time you save the file, so you don't
#     # have to stop and start it manually.
#     app.run(debug=True)
# The World Bank sends a list with two things:
# Step 1: Import all the libraries we need
from flask import Flask, jsonify  # 'jsonify' turns Python data into JSON for websites
import requests
import pandas as pd

# Step 2: Create the Flask app
app = Flask(__name__)

# Step 3: Create a function to get and clean the data
# This is 90% the same as your test_api.py script
def get_gdp_data():
    api_url = "http://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.CD?date=2012:2022&format=json"

    print("Fetching data from World Bank API...")
    
    try:
        response = requests.get(api_url)
        data = response.json()
        
        # Give the data to Pandas
        data_list = data[1]
        df = pd.DataFrame(data_list)

        # Clean the table
        clean_df = df[['date', 'value']]
        clean_df = clean_df.rename(columns={
            "value": "gdp" # Changed to 'gdp' for easier use in JavaScript
        })
        
        # --- NEW STEP ---
        # Convert the clean table (DataFrame) into a format 
        # that can be sent as JSON. 'to_dict('records')' is perfect for this.
        # It turns the table into a list of dictionaries, like:
        # [ {'date': 2022, 'gdp': 3385...}, {'date': 2021, 'gdp': 3176...} ]
        data_json = clean_df.to_dict('records')
        
        return data_json

    except Exception as e:
        print(f"Error fetching data: {e}")
        # Return an error message if it fails
        return {"error": "Failed to fetch data"}

# Step 4: Define our API route
# This is a new route. Your server now has two URLs:
# 1. http://127.0.0.1:5000/         (the old one)
# 2. http://127.0.0.1:5000/api/gdp  (our new data endpoint)
@app.route("/")
def home():
    return "Hello, World! My Flask server is running!"

@app.route("/api/gdp")
def api_gdp_data():
    print("API request received! Getting data...")
    # 1. Call our function to get the clean data
    data = get_gdp_data()
    # 2. Use 'jsonify' to send that data back to the browser
    return jsonify(data)

# Step 5: Run the app
if __name__ == "__main__":
    app.run(debug=True)


