// pages/under-construction.js
import Head from 'next/head';
import Link from 'next/link';
import ModernLayout from '../components/ModernLayout';
import { 
  Construction, 
  Home, 
  Clock, 
  AlertTriangle,
  ArrowLeft 
} from 'lucide-react';

export default function UnderConstruction() {
  return (
    <ModernLayout>
      <Head>
        <title>Under Construction | TL Waste Monitoring</title>
        <meta name="description" content="This page is currently under construction" />
      </Head>

      <div className="min-h-[calc(100vh-300px)] flex items-center justify-center bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          {/* Icon and Header */}
          <div className="mb-8 inline-block p-6 bg-amber-100 rounded-full">
            <Construction className="h-16 w-16 text-amber-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Under Construction
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            We're working hard to bring you this feature soon. Please check back later!
          </p>
          
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-10 max-w-md mx-auto">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="h-0.5 w-16 bg-amber-200 mx-2"></div>
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="h-0.5 w-16 bg-amber-200 mx-2"></div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Construction className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Page Status: In Development
            </h2>
            
            <p className="text-gray-600 text-sm">
              Our team is actively building this page. We anticipate it will be ready in the coming weeks.
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Homepage
            </Link>
            
            <Link 
              href="/map"
              className="inline-flex items-center px-5 py-2.5 bg-emerald-600 border border-transparent rounded-lg text-white hover:bg-emerald-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </div>
          
          
          {/* Message */}
          <div className="mt-12 text-sm text-gray-500">
            <p>
              We appreciate your patience as we work to improve your experience. 
            </p>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}