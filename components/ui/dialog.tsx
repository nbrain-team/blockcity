import * as React from "react"

export function Dialog({ 
  open, 
  onOpenChange, 
  children,
  className = "max-w-2xl"
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className={`relative bg-white rounded-lg shadow-lg ${className} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-6">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold">{children}</h2>;
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 mt-2">{children}</p>;
}

