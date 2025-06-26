import { useEffect, useState } from "react";
import axios from "axios";
import { CloseOutlined } from "@ant-design/icons";

type DashboardProps = {
  onClose: () => void;
};

export default function Dashboard({ onClose }: DashboardProps) {
    return (
        <div className="p-1 bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 rounded-2xl shadow-2xl w-full max-w-4xl">
            <div className="bg-black border  border-black rounded p-4">
            <button onClick={onClose} className="mb-4 text-blue-700 font-bold"><CloseOutlined style={{color: 'red'}} /></button>
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {/* Add your dashboard content here */}
        <p>Welcome to your dashboard!</p>
            </div>
    
      </div>
    );
  }
  