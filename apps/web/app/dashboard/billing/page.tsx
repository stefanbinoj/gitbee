"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Activity, Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function BillingPage() {
  const router = useRouter();
  const invoices = [
    {
      id: "INV-2025-006",
      date: "Jun 1, 2025",
      amount: "$29.00",
      status: "paid",
    },
    {
      id: "INV-2025-005",
      date: "May 1, 2025",
      amount: "$29.00",
      status: "paid",
    },
    {
      id: "INV-2025-004",
      date: "Apr 1, 2025",
      amount: "$29.00",
      status: "paid",
    },
    {
      id: "INV-2025-003",
      date: "Mar 1, 2025",
      amount: "$29.00",
      status: "paid",
    },
  ];

  return (
    <div className="space-y-6">
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-[425px] bg-neutral-900 border-neutral-800"
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Coming Soon</DialogTitle>
            <DialogDescription className="text-neutral-400">
              We are working hard to bring you billing features. This page will
              be available soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => router.back()}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-medium"
            >
              Okay, got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Usage Progress */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                Usage This Month
              </CardTitle>
              <p className="text-sm text-neutral-400 mt-1">
                Monitor your AI and storage consumption
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">AI Responses</span>
                <span className="text-white font-mono">7,234 / 10,000</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: "72.34%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">Storage</span>
                <span className="text-white font-mono">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: "24%" }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <CreditCard className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                Payment Method
              </CardTitle>
              <p className="text-sm text-neutral-400 mt-1">
                Manage your payment details and billing information
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-16 bg-neutral-800 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Visa ending in 4242
                </p>
                <p className="text-xs text-neutral-400">Expires 12/2027</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-yellow-500 bg-transparent"
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <Receipt className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider uppercase">
                Invoice History
              </CardTitle>
              <p className="text-sm text-neutral-400 mt-1">
                View and download past invoices
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    INVOICE
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    DATE
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    AMOUNT
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-white font-mono">
                      {invoice.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-300">
                      {invoice.date}
                    </td>
                    <td className="py-3 px-4 text-sm text-white font-mono">
                      {invoice.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-500 uppercase tracking-wider">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-400 hover:text-yellow-500"
                      >
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
  );
}
