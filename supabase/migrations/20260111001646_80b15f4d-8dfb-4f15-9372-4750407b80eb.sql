-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create email_templates table for saved templates
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  greeting TEXT NOT NULL,
  main_message TEXT NOT NULL,
  update_title TEXT NOT NULL,
  updates TEXT[] NOT NULL DEFAULT '{}',
  closing_message TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_url TEXT NOT NULL DEFAULT 'https://averroes.app',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Only admins can manage templates
CREATE POLICY "Admins can view all templates" 
ON public.email_templates 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create templates" 
ON public.email_templates 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update templates" 
ON public.email_templates 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete templates" 
ON public.email_templates 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();