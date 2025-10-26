'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LibraryTemplate } from '@/types';
import { Plus, FileText } from 'lucide-react';

export default function LibraryPage() {
  const [templates, setTemplates] = useState<LibraryTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/library');
      const data = await res.json();

      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading library...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Library</h1>
          <p className="text-gray-600 mt-1">Browse design templates and specifications</p>
        </div>
        <Button variant="primary">
          <Plus className="h-5 w-5 mr-2" />
          New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No templates available. Create your first template!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{template.templateName}</CardTitle>
                <p className="text-sm text-gray-600 capitalize">{template.productCategory}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Dimensions</p>
                  <p className="text-gray-700">
                    {template.dimensions.length}&apos; × {template.dimensions.width}&apos; × {template.dimensions.height}&apos;
                  </p>
                </div>
                {template.loadRequirements && template.loadRequirements.designLoad && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Design Load</p>
                    <p className="text-sm text-gray-700">{template.loadRequirements.designLoad}</p>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    Used <span className="font-bold text-indigo-600">{template.usageCount}</span> times
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


