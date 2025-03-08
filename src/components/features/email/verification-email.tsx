import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const VerificationEmail = ({ otp }: { otp: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code for Acme Inc.</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoContainer}>
            <Text style={styles.logo}>Acme Inc.</Text>
          </Section>
          <Section style={styles.content}>
            <Heading style={styles.heading}>Your Verification Code</Heading>
            <Text style={styles.paragraph}>
              Please use the verification code below to sign in to your account.
            </Text>
            <Section style={styles.codeContainer}>
              <Text style={styles.code}>{otp}</Text>
            </Section>
            <Text style={styles.paragraph}>
              This code will expire in 5 minutes. If you didn&apos;t request
              this code, please ignore this email or contact our support team.
            </Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              If you have any questions, please contact our support team at{" "}
              <Link href="mailto:support@acme.com" style={styles.link}>
                support@acme.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  container: {
    margin: "0 auto",
    padding: "20px 0",
    maxWidth: "600px",
  },
  logoContainer: {
    marginBottom: "20px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    color: "#4285F4",
  },
  content: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "40px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#555",
    marginBottom: "16px",
  },
  codeContainer: {
    margin: "24px 0",
    textAlign: "center" as const,
  },
  code: {
    display: "inline-block",
    padding: "16px 24px",
    backgroundColor: "#f4f7fa",
    borderRadius: "6px",
    fontSize: "32px",
    fontWeight: "bold",
    letterSpacing: "6px",
    color: "#333",
    fontFamily: "monospace",
  },
  hr: {
    borderColor: "#e6ebf1",
    margin: "32px 0 24px",
  },
  footer: {
    fontSize: "14px",
    color: "#777",
    textAlign: "center" as const,
  },
  link: {
    color: "#4285F4",
    textDecoration: "underline",
  },
};
