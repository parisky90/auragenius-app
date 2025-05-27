// src/app/page.tsx

// Μπορείς να κάνεις import άλλα components εδώ αν χρειάζεται
// import SomeOtherComponent from '@/components/SomeOtherComponent';

export default function HomePage() { // ΠΡΕΠΕΙ ΝΑ ΕΙΝΑΙ ΣΥΝΑΡΤΗΣΗ
    return (
      <div className="container py-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          Καλώς ήρθατε στο AuraGenius!
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Ο προσωπικός σας AI σύμβουλος στυλ και περιποίησης.
        </p>
        {/* Πρόσθεσε εδώ περισσότερο περιεχόμενο για την αρχική σελίδα */}
        {/* π.χ., ένα κουμπί "Ξεκίνα την Ανάλυσή σου!" που οδηγεί στο /analyze */}
      </div>
    );
  }