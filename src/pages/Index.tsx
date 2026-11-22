import { ConfigWizard } from "@/components/ConfigWizard";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/lib/auth";

// The wizard needs a logged-in user. It stays mounted while signed out, so a
// session that expires before "Create" keeps what was filled in.
const Index = () => {
  const { session } = useAuth();
  return (
    <>
      {!session && <LoginForm />}
      <div hidden={!session}>
        <ConfigWizard />
      </div>
    </>
  );
};

export default Index;
