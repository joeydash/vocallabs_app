import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';

export function LoginBanner() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-primary-600 p-12 flex-col justify-between">
      <div className="flex items-center space-x-2">
        <img 
          src="https://cdn.subspace.money/grow90_tracks/images/Jy0e6SZqiGaIMShho6c4.png"
          alt="Logo"
          className="h-8"
        />
      </div>
      <div className="space-y-6 text-white">
        <h2 className="text-3xl font-bold">Welcome to VocaLabs</h2>
        <p className="text-lg text-primary-100">
          Transform your customer interactions with AI-powered voice agents.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <p>Intelligent voice conversations</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-500 rounded-lg">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <p>Seamless customer engagement</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-primary-100">
        © 2024 VocaLabs. All rights reserved.
      </p>
    </div>
  );
}
