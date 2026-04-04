"use client";

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";

const plans = [
  { id: "basic", name: "Basic Plan", price: "$99 / month", features: ["Enroll up to 500 students", "Basic analytics"] },
  { id: "premium", name: "Premium Plan", price: "$199 / month", features: ["Unlimited students", "Advanced analytics", "Priority support"] },
];

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    // Fetch university subscription status (Mocked for now)
    const storedPlan = localStorage.getItem("universitySubscription");
    if (storedPlan) {
      setCurrentPlan(storedPlan);
    }
  }, []);

  const handleSubscribe = (planId: string) => {
    setCurrentPlan(planId);
    localStorage.setItem("universitySubscription", planId);
    alert(`You have subscribed to the ${planId} plan!`);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <CreditCard /> Subscription Plans
      </h2>

      {currentPlan ? (
        <div className="p-4 border border-green-500 bg-green-100 rounded-lg text-green-700">
          You are currently subscribed to the <strong>{plans.find((p) => p.id === currentPlan)?.name}</strong>.
        </div>
      ) : (
        <p className="text-gray-600 mb-4">Choose a subscription plan to enable student enrollment.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {plans.map((plan) => (
          <div key={plan.id} className="border p-6 rounded-lg shadow-md bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
            <p className="text-lg font-semibold text-purple-600 mt-2">{plan.price}</p>
            <ul className="mt-4 text-gray-600">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  ✅ {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`mt-4 w-full py-2 text-white rounded-lg ${
                currentPlan === plan.id ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
              }`}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
