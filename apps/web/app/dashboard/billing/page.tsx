"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Check, Zap, Building2, Download, Calendar, TrendingUp } from "lucide-react"

export default function BillingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Perfect for personal projects",
      features: [
        "Up to 3 repositories",
        "1,000 AI responses/month",
        "Community support",
        "Basic analytics",
      ],
      current: false,
      cta: "Downgrade",
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For growing teams",
      features: [
        "Unlimited repositories",
        "10,000 AI responses/month",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
        "Team collaboration",
      ],
      current: true,
      cta: "Current Plan",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited AI responses",
        "Dedicated support",
        "SLA guarantee",
        "Custom training",
        "On-premise option",
      ],
      current: false,
      cta: "Contact Sales",
    },
  ]

  const invoices = [
    { id: "INV-2025-006", date: "Jun 1, 2025", amount: "$29.00", status: "paid" },
    { id: "INV-2025-005", date: "May 1, 2025", amount: "$29.00", status: "paid" },
    { id: "INV-2025-004", date: "Apr 1, 2025", amount: "$29.00", status: "paid" },
    { id: "INV-2025-003", date: "Mar 1, 2025", amount: "$29.00", status: "paid" },
  ]

  return (
    <div className="space-y-6">
      {/* Current Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CURRENT PLAN</p>
                <p className="text-2xl font-bold text-yellow-500 font-mono">PRO</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AI RESPONSES</p>
                <p className="text-2xl font-bold text-white font-mono">7,234</p>
                <p className="text-xs text-neutral-500">of 10,000</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">NEXT BILLING</p>
                <p className="text-2xl font-bold text-white font-mono">Jul 1</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">REPOSITORIES</p>
                <p className="text-2xl font-bold text-white font-mono">12</p>
              </div>
              <Building2 className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">USAGE THIS MONTH</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">AI Responses</span>
                <span className="text-white font-mono">7,234 / 10,000</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all duration-300" style={{ width: "72.34%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">Storage</span>
                <span className="text-white font-mono">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all duration-300" style={{ width: "24%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-sm font-medium text-neutral-300 tracking-wider mb-4">AVAILABLE PLANS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-neutral-900 border-neutral-700 relative ${
                plan.popular ? "border-yellow-500 ring-1 ring-yellow-500/20" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              <CardHeader className="pt-6">
                <CardTitle className="text-lg font-bold text-white">{plan.name}</CardTitle>
                <p className="text-sm text-neutral-400">{plan.description}</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-neutral-400">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-neutral-300">
                      <Check className="w-4 h-4 text-yellow-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.current
                      ? "bg-neutral-700 text-neutral-300 cursor-default"
                      : plan.popular
                        ? "bg-yellow-500 hover:bg-yellow-600 text-neutral-900"
                        : "bg-neutral-800 hover:bg-neutral-700 text-white"
                  }`}
                  disabled={plan.current}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PAYMENT METHOD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-16 bg-neutral-800 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                <p className="text-xs text-neutral-400">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">INVOICE HISTORY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">INVOICE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">DATE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">AMOUNT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">STATUS</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-mono">{invoice.id}</td>
                    <td className="py-3 px-4 text-sm text-neutral-300">{invoice.date}</td>
                    <td className="py-3 px-4 text-sm text-white font-mono">{invoice.amount}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500 uppercase tracking-wider">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-yellow-500">
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
