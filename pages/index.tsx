import { Button, ChakraProvider, Input, Spacer, Stack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Session, createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://onhshdsbgcwpncrwwlqj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uaHNoZHNiZ2N3cG5jcnd3bHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE0NDgyMDQsImV4cCI6MTk5NzAyNDIwNH0.oIDi0YqtHzWeAclfe-CcUd00ExZBq_2mJsjKI5JUOOQ"
);

export default function Home() {
  const [session, setSession] = useState<Session | null>();
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log(session);

  return (
    <ChakraProvider>
      <Stack width={400} padding={10} gap={5}>
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={() => signInWithEmail(email)} colorScheme="blackAlpha">
          Send Magic Link
        </Button>
        <Spacer />
        <Button colorScheme="green">Login with Google</Button>
        <Button colorScheme="facebook">Login with Azure</Button>
        <Button colorScheme="orange">Login with Slack</Button>
      </Stack>
    </ChakraProvider>
  );
}

async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://example.com/welcome",
    },
  });
  console.log({ data, error });
}
