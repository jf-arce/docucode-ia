import { HomeScreen } from "@/screens/HomeScreen";
import { NavBar } from "@/components/NavBar";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
	const supabase = await createClient();

	const { data: user } = await supabase.auth.getUser();

	return (
		<>
			<NavBar user={user?.user} />
			<HomeScreen />
		</>
	);
}
