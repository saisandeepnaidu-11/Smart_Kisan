# Smart Kisan 🌾

**Smart Kisan** is a comprehensive agricultural platform that connects farmers and landowners, providing modern farming solutions with crop yield prediction, pest management store, and intelligent land management features.

## 🌟 Overview

Smart Kisan revolutionizes agricultural practices by bridging the gap between farmers and landowners through a modern, user-friendly web platform. The system offers intelligent crop yield predictions, a comprehensive pest control store, and streamlined land rental processes.

## ✨ Key Features

### 🔐 **Authentication & User Management**
- **Role-based Access**: Separate interfaces for farmers and landowners
- **Secure Authentication**: Email/password-based login system
- **Profile Management**: Comprehensive user profiles with contact information
- **Session Management**: Persistent login with localStorage

### 👨‍🌾 **Farmer Dashboard**
- **Land Discovery**: Browse available agricultural lands
- **Landowner Contact**: Direct communication with land owners
- **Profile Management**: Update personal information and experience
- **Land Search**: Filter lands by location, size, price, and soil type

### 🏡 **Landowner Dashboard**
- **Land Listing**: Create and manage land listings
- **Contact Information**: Share contact details with interested farmers
- **Land Management**: Update land status and details
- **Sample Data**: Quick setup with sample land listings

### 🛒 **Pest Control Store**
- **Product Catalog**: Comprehensive pest control products
- **Category Filtering**: Filter by Organic, Biological, Botanical, Chemical
- **Shopping Cart**: Add products, adjust quantities, place orders
- **Product Information**: Detailed product descriptions, ratings, and pricing
- **Order Management**: Complete order placement with confirmation

### 🌱 **Crop Yield Predictor**
- **Intelligent Predictions**: AI-powered crop yield forecasting
- **Weather Integration**: Real-time weather data for accurate predictions
- **Soil Analysis**: Comprehensive soil condition assessment
- **Farm Details**: Detailed farm information for better predictions

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful Backgrounds**: Custom background images for welcome and auth pages
- **Clean Interface**: Modern, intuitive user interface
- **Smooth Animations**: Engaging user interactions and transitions

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons

### **Backend & Database**
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Python FastAPI**: RESTful API for additional backend services
- **MongoDB**: NoSQL database for flexible data storage
- **Row Level Security (RLS)**: Secure data access

### **Development Tools**
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing
- **Git**: Version control

## 📁 **Project Structure**

```
project/
├── src/
│   ├── components/           # React components
│   │   ├── Auth/            # Authentication components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── Store/          # Store components
│   │   └── Common/         # Shared components
│   ├── contexts/           # React contexts
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Helper functions
├── backend/               # Python FastAPI backend
├── supabase/             # Database migrations
├── public/               # Static assets
└── crop-main/           # Additional crop prediction module
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   npm install
   ```

3. **Configure environment variables**
   - Update Supabase credentials in `src/lib/supabase.ts`
   - Configure MongoDB connection in `src/lib/mongodb.ts`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### **Backend Setup**

1. **Start the Python backend**
   
   ```bash
    cd backend
    pip install fastapi "uvicorn[standard]" pymongo python-multipart

   ```

   ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Database setup**
   - Run Supabase migrations
   - Configure MongoDB collections

## 🎯 **User Journey**

### **For Farmers**
1. **Welcome Page**: Choose "I'm a Farmer" role
2. **Authentication**: Sign up or login
3. **Dashboard**: View available lands and manage profile
4. **Land Discovery**: Browse and filter available lands
5. **Contact Landowners**: Get in touch with land owners
6. **Pest Store**: Shop for agricultural products
7. **Crop Prediction**: Get yield predictions for planning

### **For Landowners**
1. **Welcome Page**: Choose "I'm a Landowner" role
2. **Authentication**: Sign up or login
3. **Dashboard**: Manage land listings and profile
4. **Add Land**: Create new land listings

5. **Manage Listings**: Update land information
6. **Contact Management**: Share contact details with farmers

## 🛒 **Pest Store Features**

- **Product Categories**: Organic, Biological, Botanical, Chemical
- **Smart Cart**: Add/remove products, adjust quantities
- **Order Processing**: Complete order placement workflow
- **Product Details**: Comprehensive product information
- **Price Management**: Real-time price calculations

## 🌾 **Crop Prediction System**

- **Weather Data**: Real-time weather integration
- **Soil Analysis**: Comprehensive soil condition assessment
- **Yield Forecasting**: AI-powered predictions
- **Farm Planning**: Strategic crop planning tools

## 🔧 **Configuration**

### **Supabase Setup**
1. Create a Supabase project
2. Update credentials in `src/lib/supabase.ts`
3. Run database migrations

### **MongoDB Setup**
1. Set up MongoDB instance
2. Configure connection in `src/lib/mongodb.ts`
3. Set up collections and indexes

## 📱 **Responsive Design**

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Perfect tablet experience
- **Desktop**: Full-featured desktop interface
- **Cross-browser**: Works on all modern browsers

## 🔒 **Security Features**

- **Authentication**: Secure user authentication
- **Authorization**: Role-based access control
- **Data Protection**: Secure data transmission
- **Session Management**: Secure session handling

## 🚀 **Deployment**

### **Frontend Deployment**
- **Vercel**: Recommended for React applications
- **Netlify**: Alternative deployment option
- **Build Command**: `npm run build`

### **Backend Deployment**
- **Railway**: For Python FastAPI backend
- **Heroku**: Alternative backend hosting
- **Database**: Supabase cloud database

## 🔮 **Future Enhancements**

- **Mobile App**: Native mobile applications
- **IoT Integration**: Smart farming sensors
- **AI Chatbot**: Intelligent farming assistant
- **Marketplace**: Direct farmer-to-consumer sales
- **Weather Alerts**: Advanced weather notifications

---

**Smart Kisan** - Revolutionizing agriculture through technology! 🌾✨





