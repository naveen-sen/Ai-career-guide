import { getUserOnboardingStatus } from "../../../../actions/user";
import { getIndustryInsights } from "../../../../actions/dashboard";
import { redirect } from "next/navigation";
import DashboardClient from "./_components/dashboard-client";

export default async function IndustryInsightsPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  return <DashboardClient insights={insights} />;
}
