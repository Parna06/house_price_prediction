import json
import pickle
import numpy as np

__locations = None
__data_columns = None
__model = None

def load_saved():
    global __data_columns
    global __locations
    global __model
    
    print("Loading columns.json...")
    with open("columns.json", 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]  # First 3 columns are sqft, bath, bhk
    
    print("Loading model...")
    with open("banglore_home_prices_model.pickle", 'rb') as f:
        __model = pickle.load(f)
    
    print(f"Loaded {len(__locations)} locations")

def get_location_names():
    return __locations

def get_estimated_price(location, sqft, bhk, bath):
    try:
        # Convert location to lowercase for case-insensitive comparison
        location = location.lower().strip()
        
        # Find the location index
        loc_index = __data_columns.index(location)
        
        # Create input array
        x = np.zeros(len(__data_columns))
        x[0] = float(sqft)
        x[1] = float(bath)
        x[2] = float(bhk)
        
        if loc_index >= 0:
            x[loc_index] = 1
            
        # Make prediction
        price = float(__model.predict([x])[0])
        return round(price, 2)
        
    except ValueError as e:
        print(f"Error: Location '{location}' not found in data columns")
        return None
    except Exception as e:
        print(f"Error in price prediction: {str(e)}")
        return None

if __name__ == "__main__":
    load_saved()
    print("\nTesting predictions:")
    print("1st Phase JP Nagar, 1000 sqft, 2 bhk, 2 bath:", 
          get_estimated_price("1st phase jp nagar", 1000, 2, 2))
    print("1st Block Jayanagar, 1000 sqft, 3 bhk, 3 bath:", 
          get_estimated_price("1st block jayanagar", 1000, 3, 3))