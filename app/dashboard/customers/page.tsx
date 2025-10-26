'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Customer } from '@/types';
import { Plus, Search, Mail, Phone, Edit } from 'lucide-react';
import { NewCustomerModal } from '@/components/customers/new-customer-modal';
import { EditCustomerModal } from '@/components/customers/edit-customer-modal';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();

      if (data.success) {
        setCustomers(data.data.customers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          onClick={() => setShowNewCustomerModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -tranpurple-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{customer.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{customer.contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{customer.contactInfo.phone}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Total Projects</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {customer.projectHistory.totalProjects}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Active</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {customer.projectHistory.activeProjects}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setShowEditCustomerModal(true);
                }}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewCustomerModal 
        isOpen={showNewCustomerModal}
        onClose={() => setShowNewCustomerModal(false)}
        onSuccess={fetchCustomers}
      />

      <EditCustomerModal
        isOpen={showEditCustomerModal}
        customer={selectedCustomer}
        onClose={() => {
          setShowEditCustomerModal(false);
          setSelectedCustomer(null);
        }}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}


