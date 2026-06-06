from fastapi import FastAPI, HTTPException, Body
from pymongo import MongoClient
from pydantic import BaseModel
import os
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
from bson import ObjectId

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://nandukumar9980:kumar456@cluster0.ecnna5x.mongodb.net/student-form?retryWrites=true&w=majority")
client = MongoClient(MONGO_URI)
db = client["farm"]

# Models
class SignupModel(BaseModel):
    email: str
    password: str
    full_name: str
    role: str  # 'farmer' or 'landowner'

class LoginModel(BaseModel):
    email: str
    password: str

class FormDataModel(BaseModel):
    data: dict

class ProfileUpdateModel(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class LandModel(BaseModel):
    owner_id: str
    title: str
    description: Optional[str] = None
    location: str
    area: float
    price_per_acre: Optional[float] = None
    soil_type: Optional[str] = None
    water_availability: Optional[str] = None
    status: str = 'available'

@app.post("/api/signup")
def signup(data: SignupModel):
    collection = db[data.role + "s"]  # farmers or landowners
    if collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user_data = {
        **data.dict(),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    result = collection.insert_one(user_data)
    return {
        "message": "Signup successful", 
        "role": data.role,
        "user_id": str(result.inserted_id),
        "email": data.email,
        "full_name": data.full_name
    }

@app.post("/api/login")
def login(data: LoginModel):
    for role in ["farmers", "landowners"]:
        user = db[role].find_one({"email": data.email, "password": data.password})
        if user:
            return {
                "message": "Login successful", 
                "role": role[:-1], 
                "full_name": user.get("full_name"),
                "email": user.get("email"),
                "user_id": str(user["_id"]),
                "_id": str(user["_id"])
            }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    for role in ["farmers", "landowners"]:
        try:
            # First try to find by ObjectId
            try:
                user = db[role].find_one({"_id": ObjectId(user_id)})
                if user:
                    user["_id"] = str(user["_id"])
                    return user
            except:
                pass
            
            # If ObjectId fails, try to find by string ID field (for sample_owner_1, etc.)
            user = db[role].find_one({"_id": user_id})
            if user:
                return user
        except:
            continue
    raise HTTPException(status_code=404, detail="Profile not found")

@app.put("/api/profile/{user_id}")
def update_profile(user_id: str, updates: ProfileUpdateModel):
    for role in ["farmers", "landowners"]:
        try:
            user = db[role].find_one({"_id": ObjectId(user_id)})
            if user:
                update_data = {k: v for k, v in updates.dict().items() if v is not None}
                update_data["updated_at"] = datetime.now().isoformat()
                db[role].update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
                updated_user = db[role].find_one({"_id": ObjectId(user_id)})
                updated_user["_id"] = str(updated_user["_id"])
                return updated_user
        except:
            continue
    raise HTTPException(status_code=404, detail="Profile not found")

@app.get("/api/lands")
def get_lands():
    lands = list(db["lands"].find())
    for land in lands:
        land["_id"] = str(land["_id"])
    return lands

@app.get("/api/lands/user/{user_id}")
def get_user_lands(user_id: str):
    lands = list(db["lands"].find({"owner_id": user_id}))
    for land in lands:
        land["_id"] = str(land["_id"])
    return lands

@app.post("/api/lands")
def create_land(land: LandModel):
    land_data = {
        **land.dict(),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    result = db["lands"].insert_one(land_data)
    created_land = db["lands"].find_one({"_id": result.inserted_id})
    created_land["_id"] = str(created_land["_id"])
    return created_land

@app.put("/api/lands/{land_id}")
def update_land(land_id: str, updates: dict):
    try:
        update_data = {k: v for k, v in updates.items() if v is not None}
        update_data["updated_at"] = datetime.now().isoformat()
        db["lands"].update_one({"_id": ObjectId(land_id)}, {"$set": update_data})
        updated_land = db["lands"].find_one({"_id": ObjectId(land_id)})
        if updated_land:
            updated_land["_id"] = str(updated_land["_id"])
            return updated_land
        raise HTTPException(status_code=404, detail="Land not found")
    except:
        raise HTTPException(status_code=404, detail="Land not found")

@app.delete("/api/lands/{land_id}")
def delete_land(land_id: str):
    try:
        result = db["lands"].delete_one({"_id": ObjectId(land_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Land not found")
        return {"message": "Land deleted successfully"}
    except:
        raise HTTPException(status_code=404, detail="Land not found")

@app.post("/api/form")
def store_form(data: FormDataModel):
    db["forms"].insert_one(data.data)
    return {"message": "Form data stored successfully in farm database"}

@app.on_event("startup")
async def startup_event():
    """Create sample landowner profiles if they don't exist"""
    sample_owners = [
        {
            "_id": "sample_owner_1",
            "email": "owner1@example.com",
            "password": "password123",
            "full_name": "Rajesh Kumar",
            "role": "landowner",
            "phone": "9876543210",
            "address": "Punjab, India",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "_id": "sample_owner_2",
            "email": "owner2@example.com",
            "password": "password123",
            "full_name": "Priya Singh",
            "role": "landowner",
            "phone": "9876543211",
            "address": "Karnataka, India",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "_id": "sample_owner_3",
            "email": "owner3@example.com",
            "password": "password123",
            "full_name": "Amit Patel",
            "role": "landowner",
            "phone": "9876543212",
            "address": "Maharashtra, India",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "_id": "sample_owner_4",
            "email": "owner4@example.com",
            "password": "password123",
            "full_name": "Kavya Reddy",
            "role": "landowner",
            "phone": "9876543213",
            "address": "Telangana, India",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "_id": "sample_owner_5",
            "email": "owner5@example.com",
            "password": "password123",
            "full_name": "Suresh Rao",
            "role": "landowner",
            "phone": "9876543214",
            "address": "Andhra Pradesh, India",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]
    
    for owner in sample_owners:
        existing = db["landowners"].find_one({"_id": owner["_id"]})
        if not existing:
            db["landowners"].insert_one(owner)
            print(f"Created sample landowner: {owner['_id']}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
