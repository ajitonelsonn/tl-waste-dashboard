// pages/download.js
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ModernLayout from "../components/Layout";
import {
  Download,
  Smartphone,
  Camera,
  MapPin,
  Trash2,
  CheckCircle,
  ChevronRight,
  ArrowDown,
} from "lucide-react";

export default function DownloadApp() {
  const [activeTab, setActiveTab] = useState("android"); // 'android' or 'ios'

  // App download links
  const downloadLinks = {
    android:
      "https://drive.google.com/file/d/1h9KIEqflPIV5HiX68AEpg9RXmF7BBw-y/view",
    ios: "/uc",
    direct:
      "https://drive.google.com/file/d/1h9KIEqflPIV5HiX68AEpg9RXmF7BBw-y/view",
  };

  return (
    <ModernLayout>
      <Head>
        <title>Download App | TL Waste Monitoring</title>
        <meta
          name="description"
          content="Download the Timor-Leste Waste Monitoring mobile application"
        />
      </Head>

      <div className="bg-gradient-to-b from-emerald-50 to-white pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Download the TL Waste Monitor App
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Help keep Timor-Leste clean by reporting waste incidents from your
              mobile device
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - QR Code and Download Links */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Scan QR Code to Download
                </h2>
                <p className="text-gray-600 mb-6">
                  Use your phone's camera to scan this QR code for a direct
                  download link
                </p>

                <div className="max-w-xs mx-auto p-4 border-2 border-dashed border-emerald-200 rounded-lg bg-white">
                  <Image
                    src="/qr-code_app.svg"
                    alt="QR Code to download app"
                    width={250}
                    height={250}
                    className="mx-auto"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Or download directly
                </h3>

                {/* Platform selector tabs */}
                <div className="flex border border-gray-200 rounded-lg mb-6 p-1 max-w-sm mx-auto">
                  <button
                    onClick={() => setActiveTab("android")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                      activeTab === "android"
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors`}
                  >
                    Android
                  </button>
                  <button
                    onClick={() => setActiveTab("ios")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
                      activeTab === "ios"
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors`}
                  >
                    iOS
                  </button>
                </div>

                {/* Download button for the selected platform */}
                <a
                  href={downloadLinks[activeTab]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm mx-auto"
                >
                  <Download className="w-5 h-5" />
                  Download for{" "}
                  {activeTab === "android" ? "Android" : "iOS SOON"}
                </a>

                <div className="mt-4 text-sm text-gray-500">
                  Version 1.1.1 • Released March 29, 2025
                </div>

                <div className="mt-6">
                  <a
                    href={downloadLinks.direct}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium inline-flex items-center"
                  >
                    Direct download link
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right side - App Features */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                App Features
              </h2>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                    <Camera className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Easy Photo Reporting
                    </h3>
                    <p className="text-gray-600">
                      Take photos of waste incidents directly in the app with
                      automatic GPS location tagging
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Interactive Map
                    </h3>
                    <p className="text-gray-600">
                      View nearby waste incidents and hotspots to stay informed
                      about your community
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
                  <div className="bg-emerald-100 rounded-full p-3 flex-shrink-0">
                    <Trash2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Track Clean-up Efforts
                    </h3>
                    <p className="text-gray-600">
                      Follow the status of your reported incidents and see when
                      they're resolved
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center sm:text-left">
                <Link
                  href="/about"
                  className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
                >
                  Learn more about our waste monitoring program
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  1. Report Waste
                </h3>
                <p className="text-gray-600">
                  Take a photo and provide details about the waste incident
                  you've found
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  2. Submit & Track
                </h3>
                <p className="text-gray-600">
                  Submit your report and track its status as it's processed by
                  authorities
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  3. Community Impact
                </h3>
                <p className="text-gray-600">
                  Your reports help identify waste hotspots and guide cleanup
                  resources
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-24 text-center">
            <div className="inline-flex items-center justify-center">
              <ArrowDown className="w-6 h-6 text-emerald-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-6">
              Download now and start making a difference
            </h2>
            <a
              href={downloadLinks.direct}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              <Download className="w-5 h-5" />
              Download App
            </a>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
