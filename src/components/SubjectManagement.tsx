import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Subject {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
}

interface SubjectManagementProps {
  onSubjectSelect: (subjectId: string) => void;
  selectedSubjectId?: string;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({ onSubjectSelect, selectedSubjectId }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newSubject, setNewSubject] = useState({ name: '', description: '', color: '#8B5CF6' });
  const [userPlan, setUserPlan] = useState<string>('freemium');
  const { user } = useAuth();
  const { toast } = useToast();

  const colors = [
    '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', 
    '#EF4444', '#3B82F6', '#8B5A2B', '#6B7280'
  ];

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchSubjects();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserPlan(data.plan_type || 'freemium');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subjects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateSubject = async () => {
    if (!newSubject.name.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required.",
        variant: "destructive",
      });
      return;
    }

    // Check freemium limitations
    if (userPlan === 'freemium' && !editingSubject && subjects.length >= 3) {
      toast({
        title: "Upgrade Required",
        description: "Free users can only create up to 3 subjects. Upgrade to Premium for unlimited subjects.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSubject) {
        // Update existing subject
        const { error } = await supabase
          .from('subjects')
          .update({
            name: newSubject.name,
            description: newSubject.description || null,
            color: newSubject.color
          })
          .eq('id', editingSubject.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Subject updated successfully.",
        });
      } else {
        // Create new subject
        const { data, error } = await supabase
          .from('subjects')
          .insert({
            user_id: user?.id,
            name: newSubject.name,
            description: newSubject.description || null,
            color: newSubject.color
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Subject created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingSubject(null);
      setNewSubject({ name: '', description: '', color: '#8B5CF6' });
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: "Error",
        description: "Failed to save subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subject deleted successfully.",
      });
      
      fetchSubjects();
      if (selectedSubjectId === subjectId) {
        onSubjectSelect('');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setNewSubject({
      name: subject.name,
      description: subject.description || '',
      color: subject.color
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSubject(null);
    setNewSubject({ name: '', description: '', color: '#8B5CF6' });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Subjects</h2>
          <p className="text-muted-foreground">
            Organize your flashcards by subject
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={openCreateDialog}
              disabled={userPlan === 'freemium' && subjects.length >= 3}
              className="btn-hero"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Edit Subject' : 'Create New Subject'}
              </DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Update your subject details' : 'Add a new subject to organize your flashcards'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject Name</label>
                <Input
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g., Mathematics, History, Biology"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  placeholder="Brief description of this subject"
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newSubject.color === color ? 'border-foreground scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewSubject({ ...newSubject, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrUpdateSubject} className="btn-hero">
                {editingSubject ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Freemium Limitation Alert */}
      {userPlan === 'freemium' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Free plan: {subjects.length}/3 subjects used. 
                {subjects.length >= 3 && " Upgrade to Premium for unlimited subjects."}
              </span>
              {subjects.length >= 3 && (
                <Button 
                  size="sm" 
                  className="btn-hero ml-4"
                  onClick={() => window.location.href = '/upgrade'}
                >
                  Upgrade Now
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card 
            key={subject.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedSubjectId === subject.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSubjectSelect(subject.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(subject);
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubject(subject.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {subject.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {subject.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Subject
                </Badge>
                {selectedSubjectId === subject.id && (
                  <Badge className="text-xs bg-primary">
                    Selected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {subjects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No subjects yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first subject to organize your flashcards
            </p>
            <Button onClick={openCreateDialog} className="btn-hero">
              <Plus className="w-4 h-4 mr-2" />
              Create First Subject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectManagement;