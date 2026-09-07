import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SafetyDisclaimer } from "@/components/ui/SafetyDisclaimer";

export default function DisclaimerPage() {
  return (
    <div className="container-app py-12 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-brand-green mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Wellness Disclaimer</h1>
      <p className="text-text-muted mb-8">Last updated: August 2026</p>

      <SafetyDisclaimer className="mb-8" />

      <div className="prose prose-brand max-w-none text-text-secondary">
        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">1. Not Medical Advice</h2>
        <p className="mb-4">
          The information, recipes, and recommendations provided by NutriFlow are for general educational and informational purposes only. NutriFlow is a tool to help organize everyday cooking decisions, not a medical diagnostic system or a prescription for treating disease.
        </p>
        <p className="mb-6">
          You should not use the information on this application for diagnosing or treating a health problem or disease, or prescribing any medication or other treatment. Always seek the advice of your physician, registered dietitian, or other qualified health provider with any questions you may have regarding a medical condition.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">2. Nutritional Estimates</h2>
        <p className="mb-4">
          Nutritional information provided alongside recipes is an estimate based on publicly available food databases. Actual nutritional values will vary based on:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>The specific brands of ingredients you purchase.</li>
          <li>Natural variations in fresh produce.</li>
          <li>The exact amount of oil, salt, or sugar you use during cooking.</li>
          <li>Portion sizes.</li>
        </ul>
        <p className="mb-6">
          NutriFlow does not guarantee the exact accuracy of these nutritional estimates and should not be relied upon for strict medical diets (e.g., precise carbohydrate counting for Type 1 Diabetes).
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">3. Allergies and Food Safety</h2>
        <p className="mb-4">
          While NutriFlow allows you to filter recipes by common allergens, the ultimate responsibility for food safety lies with you, the user. 
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Always carefully read the ingredient labels on packaged foods you purchase, as manufacturing practices and cross-contamination risks change.</li>
          <li>If you have a severe or life-threatening food allergy (e.g., anaphylaxis), do not rely solely on the app's filtering system. Always double-check recipe ingredients manually.</li>
          <li>Ensure proper food handling, storage, and cooking temperatures to prevent foodborne illnesses.</li>
        </ul>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">4. No Guaranteed Outcomes</h2>
        <p className="mb-6">
          NutriFlow provides suggestions based on deterministic logic to align with your stated goals (e.g., eating more balanced meals). However, we make no guarantees regarding specific health outcomes, weight loss, or physiological changes as a result of using the application.
        </p>

        <h2 className="text-xl font-bold text-text-primary mt-8 mb-4">5. User Responsibility</h2>
        <p className="mb-6">
          By using NutriFlow, you acknowledge and agree that you are solely responsible for your health decisions, dietary choices, and cooking practices. NutriFlow and its creators shall not be held liable for any adverse reactions, injuries, or health issues resulting from the use of the recipes or recommendations provided by the application.
        </p>
      </div>
    </div>
  );
}
