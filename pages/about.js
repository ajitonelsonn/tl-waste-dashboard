// pages/about.js
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ModernLayout from "../components/ModernLayout";
import {
  Users,
  Globe,
  BarChart2,
  Award,
  MapPin,
  Mail,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  // FAQ items array
  const faqItems = [
    {
      question: "What is the TL Digital Waste Monitoring Network?",
      answer:
        "The TL Digital Waste Monitoring Network is an AI-powered system that addresses waste management challenges in Timor-Leste through a network of intelligent agents. It enables citizens to report waste issues via a mobile app, provides authorities with actionable insights through an analytical dashboard, and facilitates data-driven decision-making for waste management.",
    },
    {
      question: "How can I contribute to the project?",
      answer:
        "You can download our mobile app to report waste issues in your area, explore the public dashboard to view waste hotspots, or even deploy your own instance of our system by accessing our GitHub repositories. All code and documentation are available open-source.",
    },
    {
      question: "How does the AI analysis work?",
      answer:
        "Our system uses two specialized AI agents on the Fetch.ai Agentverse platform. The Reporting Agent handles report intake and image storage, while the Analysis Agent uses ASI-1 Mini's multimodal capabilities to analyze waste images, classify waste types, assess severity, and identify potential environmental impacts. The system also detects waste hotspots using spatial clustering algorithms.",
    },
    {
      question: "Who is behind this initiative?",
      answer:
        "The project was created by Ajito Nelson Lucio da Costa for the Global AI Agents League Hackathon. It addresses real waste management challenges in Timor-Leste based on JICA survey data showing that Dili produces over 300 tons of waste daily, with more than 100 tons going uncollected.",
    },
    {
      question: "Is my data private when I submit reports?",
      answer:
        "We take data privacy seriously. While report locations and images are shared publicly to help address waste issues, user authentication is secured using JWT tokens with PBKDF2-SHA256 password hashing. All personal data is handled in accordance with our privacy policy.",
    },
  ];

  return (
    <ModernLayout>
      <Head>
        <title>About | TL Digital Waste Monitoring Network</title>
        <meta
          name="description"
          content="AI-powered waste management system for Timor-Leste"
        />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-50 to-white pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About the TL Digital Waste Monitoring Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            AI-powered waste management system connecting citizens, authorities,
            and technology to combat waste management challenges in Timor-Leste
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/download"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              Get the App
            </Link>
            <Link
              href="/map"
              className="px-6 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors font-medium shadow-sm"
            >
              View the Map
            </Link>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                The TL Digital Waste Monitoring Network aims to address
                Timor-Leste's waste management challenges through a network of
                intelligent agents, community engagement, and data-driven
                decision-making.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Dili produces over 300 tons of waste daily, with more than 100
                tons going uncollected. This waste clogs drainage systems,
                causing flooding and environmental damage.
              </p>
              <p className="text-lg text-gray-600">
                Our vision is a cleaner Timor-Leste where communities are
                empowered to report waste issues, authorities have the data they
                need to prioritize cleanup efforts, and environmental health
                improves.
              </p>
            </div>
            <div className="lg:ml-auto">
              <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-100">
                <h3 className="text-xl font-bold text-emerald-800 mb-4">
                  Expected First-Year Impact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      5,000+
                    </div>
                    <div className="text-sm text-gray-600">Citizen Reports</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      100+
                    </div>
                    <div className="text-sm text-gray-600">
                      Hotspots Identified
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      30%
                    </div>
                    <div className="text-sm text-gray-600">
                      Reduction in Blockages
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      20%
                    </div>
                    <div className="text-sm text-gray-600">
                      Collection Efficiency
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>

          <div className="relative">
            {/* Timeline connector */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-emerald-200 transform -translate-x-1/2"></div>

            {/* Timeline items */}
            <div className="space-y-16">
              {/* Item 1 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                    <h3 className="text-xl font-bold text-emerald-700 mb-2">
                      Citizen Reporting
                    </h3>
                    <p className="text-gray-600">
                      Citizens use our Flutter-based mobile app to report waste
                      with photos and location data. The app works in
                      low-connectivity environments and uploads reports to our
                      Reporting Agent.
                    </p>
                  </div>

                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                    <div className="bg-emerald-500 rounded-full h-10 w-10 flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-white font-bold">1</span>
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                      <Image
                        src="/hw/1.jpg"
                        alt="Community reporting illustration"
                        width={600}
                        height={300}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-last md:order-first">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                      <Image
                        src="/hw/2.jpg"
                        alt="Data analysis illustration"
                        width={600}
                        height={300}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                    <div className="bg-emerald-500 rounded-full h-10 w-10 flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-white font-bold">2</span>
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12 md:text-left">
                    <h3 className="text-xl font-bold text-emerald-700 mb-2">
                      AI-Powered Analysis
                    </h3>
                    <p className="text-gray-600">
                      Our Analysis Agent processes waste images using ASI-1 Mini
                      to classify waste types, assess severity, and evaluate
                      environmental impact. The system also detects hotspots
                      where multiple waste reports are clustered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                    <h3 className="text-xl font-bold text-emerald-700 mb-2">
                      Coordination & Action
                    </h3>
                    <p className="text-gray-600">
                      The data is used to prioritize cleanup efforts, directing
                      resources to the most critical areas. The system maintains
                      a database of waste issues and their status, tracking
                      progress from report to resolution.
                    </p>
                  </div>

                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                    <div className="bg-emerald-500 rounded-full h-10 w-10 flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-white font-bold">3</span>
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                      <Image
                        src="/hw/3.jpg"
                        alt="Coordination and action illustration"
                        width={600}
                        height={300}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="relative">
                <div className="md:flex items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 order-last md:order-first">
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                      <Image
                        src="/hw/4.jpg"
                        alt="Monitoring and reporting illustration"
                        width={600}
                        height={300}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/4">
                    <div className="bg-emerald-500 rounded-full h-10 w-10 flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-white font-bold">4</span>
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-12 md:text-left">
                    <h3 className="text-xl font-bold text-emerald-700 mb-2">
                      Public Dashboard
                    </h3>
                    <p className="text-gray-600">
                      Our Next.js web dashboard provides visualizations of waste
                      data, including interactive maps, analytics, and community
                      leaderboards. This creates transparency and helps measure
                      the impact of interventions over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="bg-emerald-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Interactive Mapping
              </h3>
              <p className="text-gray-600">
                Visual representation of waste incidents and hotspots across
                Timor-Leste with detailed filtering and spatial clustering.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="bg-emerald-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600">
                ASI-1 Mini integration for waste classification, severity
                assessment, and environmental impact evaluation from report
                images.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="bg-emerald-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Agent Communication
              </h3>
              <p className="text-gray-600">
                Fetch.ai's Agentverse platform enables seamless communication
                between Reporting and Analysis Agents for efficient data
                processing.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="bg-emerald-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Low-Bandwidth Support
              </h3>
              <p className="text-gray-600">
                Mobile app optimized for Timor-Leste's connectivity challenges,
                with efficient image compression.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Our Technology Stack
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We leverage cutting-edge technologies to create a robust waste
            monitoring system
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center flex-col">
              <div className="font-bold text-gray-900">Fetch.ai Agentverse</div>
              <div className="text-sm text-gray-600">Agent Platform</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center flex-col">
              <div className="font-bold text-gray-900">ASI-1 Mini</div>
              <div className="text-sm text-gray-600">Multimodal AI</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center flex-col">
              <div className="font-bold text-gray-900">Flutter</div>
              <div className="text-sm text-gray-600">Mobile App</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm h-24 w-full flex items-center justify-center flex-col">
              <div className="font-bold text-gray-900">Next.js</div>
              <div className="text-sm text-gray-600">Web Dashboard</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      openFaq === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-emerald-800 rounded-full mx-auto w-20 h-20 flex items-center justify-center mb-6">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Download our app, report waste incidents, and become part of the
            solution for a cleaner Timor-Leste
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/download"
              className="px-6 py-3 bg-white text-emerald-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Download the App
            </Link>

            <Link
              href="https://github.com/ajitonelsonn/TLWasteR"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 text-white border border-emerald-500 rounded-lg hover:bg-emerald-800 transition-colors font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </Link>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            LAFAEK AI is a dedicated team of innovators working to create
            technological solutions for challenges in Timor-Leste.
          </p>
          <div className="flex flex-col items-center mb-16">
            <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-emerald-500 shadow-lg">
              <Image
                src="/team/ajito.jpg"
                alt="Ajito Nelson Lucio da Costa"
                width={160}
                height={160}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/160?text=Ajito";
                }}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Ajito Nelson Lucio da Costa
            </h3>
            <p className="text-emerald-600 font-medium mb-3">
              Founder & Lead Developer
            </p>
            <p className="text-gray-600 max-w-md text-center mb-4">
              Passionate about using technology to create positive environmental
              impact in Timor-Leste through innovative solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/ajitonelson"
                className="text-emerald-600 hover:text-emerald-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com/ajitonelsonn"
                className="text-emerald-600 hover:text-emerald-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/ajitonelson/"
                className="text-emerald-600 hover:text-emerald-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              LAFAEK AI Team
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Our diverse team brings together expertise in software
              development, environmental science, data analysis, and community
              engagement to create AI-powered solutions for Timor-Leste's
              environmental challenges.
            </p>

            <div className="inline-flex bg-emerald-50 rounded-full px-6 py-3 border border-emerald-100 text-emerald-700 font-medium mb-4">
              Lafaek means "Crocodile" in Tetum, symbolizing our commitment to
              protecting Timor-Leste's environment
            </div>
          </div>
        </div>
      </div>

      {/* Project Repositories Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Repositories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a
              href="https://github.com/ajitonelsonn/TLWasteR"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-emerald-200 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                TL Digital Waste Monitoring Network
              </h3>
              <p className="text-gray-600 mb-2">
                Main project overview with system architecture, documentation,
                and integration guides.
              </p>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  All
                </span>
              </div>
            </a>

            <a
              href="https://github.com/ajitonelsonn/tl-waste-monitoring"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-emerald-200 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                TL Waste Monitoring Backend
              </h3>
              <p className="text-gray-600 mb-2">
                Backend system with AI agents, API services, and database
                integration using Fetch.ai SDK.
              </p>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Fetch.ai
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ASI-1 Mini
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Python Flask
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  MySQL
                </span>
              </div>
            </a>

            <a
              href="https://github.com/ajitonelsonn/tl_waste_report"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-emerald-200 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                TL Waste Report App
              </h3>
              <p className="text-gray-600 mb-2">
                Mobile application for citizens to report waste issues, built
                with Flutter for cross-platform compatibility.
              </p>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Flutter
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Dart
                </span>
              </div>
            </a>

            <a
              href="https://github.com/ajitonelsonn/tl-waste-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-emerald-200 transition-colors"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                TL Waste Dashboard
              </h3>
              <p className="text-gray-600 mb-2">
                Web interface for visualization and analysis of waste management
                data, built with Next.js.
              </p>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black text-white">
                  Next.js
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                  Tailwind CSS
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Agents on Agentverse Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Agents on Agentverse
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our system uses two specialized AI agents registered on the Fetch.ai
            Agentverse platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Reporting Agent
              </h3>
              <p className="font-mono text-xs text-gray-500 mb-4 break-all">
                agent1q274qa27j4lxzrj8zn3rerd9c93e7a4y0ms5vfjtwlswrv5knxz7gp5twla
              </p>
              <p className="text-gray-600 mb-4">
                Handles waste reports from citizens, manages image storage on
                AWS S3, and communicates with the Analysis Agent to trigger
                waste classification.
              </p>
              <a
                href="https://agentverse.ai/agents/details/agent1q274qa27j4lxzrj8zn3rerd9c93e7a4y0ms5vfjtwlswrv5knxz7gp5twla"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
              >
                View on Agentverse
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Analysis Agent
              </h3>
              <p className="font-mono text-xs text-gray-500 mb-4 break-all">
                agent1qd4r764zmlp0rfh04s08km9v5sh3wvrjl06pm20ckfkltkqtww9jzrlanke
              </p>
              <p className="text-gray-600 mb-4">
                Processes waste images using ASI-1 Mini's multimodal
                capabilities to classify waste types, assess severity, and
                identify potential environmental impacts.
              </p>
              <a
                href="https://agentverse.ai/agents/details/agent1qd4r764zmlp0rfh04s08km9v5sh3wvrjl06pm20ckfkltkqtww9jzrlanke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center"
              >
                View on Agentverse
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}
