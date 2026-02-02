import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthShell
            title="Create your account"
            subtitle="Join SkillBridge and start learning with expert tutors."
        >
            <RegisterForm />
        </AuthShell>
    );
}
