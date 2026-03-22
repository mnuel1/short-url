import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../ui/components";
import { AuthModal } from "../../ui/AuthModal";
import { UrlShortenerForm } from "../urlform";

interface LandingPageProps {
	onDash: () => void
}

const LandingPage = ({ onDash }: LandingPageProps) => {
	const { isAuthenticated } = useAuth();
	const [authOpen, setAuthOpen] = useState(false);
	const [authMode, setAuthMode] = useState("login");
	
	const open = (m: any) => {
		setAuthMode(m);
		setAuthOpen(true);
	};
	useEffect(() => {
		if (isAuthenticated && authOpen) {
			setAuthOpen(false);
			onDash();
		}
	}, [isAuthenticated]);

	const success = () => {

	}
	return (
		<div
			className="min-h-screen bg-[#FAF7F3] flex flex-col"
			style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}
		>
			<nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 bg-[#0D0D0D] rounded-lg flex items-center justify-center">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#F5F0E8"
							strokeWidth="2.5"
						>
							<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
							<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
						</svg>
					</div>
					<span
						className="font-semibold text-[#0D0D0D] text-xl tracking-tight"
						style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
					>
						snip
					</span>
				</div>
				<div className="flex items-center gap-3">
					{isAuthenticated ? (
						<Button onClick={onDash} size="sm">
							Open Dashboard →
						</Button>
					) : (
						<>
							<Button variant="ghost" size="sm" onClick={() => open("login")}>
								Sign in
							</Button>
							<Button size="sm" onClick={() => open("register")}>
								Get started
							</Button>
						</>
					)}
				</div>
			</nav>
			<main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-3xl mx-auto w-full">
				<h1
					className="text-6xl font-normal text-[#0D0D0D] leading-tight tracking-tight mb-4"
					style={{
						fontFamily: "'DM Serif Display',Georgia,serif",
						fontSize: "clamp(2.8rem,8vw,5rem)",
					}}
				>
					Make it short
					<br />
					<em className="text-[#9B9590]">& simple.</em>
				</h1>
				<p className="text-base text-[#6B6560] max-w-sm leading-relaxed mb-10">
					Paste any URL, get a clean short link in seconds. Track clicks, share
					QR codes, manage everything in one place.
				</p>
				<div className="w-full max-w-2xl bg-white border border-[#E8E3DA] rounded-2xl p-6 shadow-sm">
					<UrlShortenerForm onSuccess={() => success()} compact={false} />
					{!isAuthenticated && (
						<p className="mt-4 text-xs text-[#9B9590] text-center">
							Want to save your links?{" "}
							<button
								className="text-[#0D0D0D] font-medium hover:underline cursor-pointer"
								onClick={() => open("register")}
							>
								Create a free account →
							</button>
						</p>
					)}
				</div>
				<div className="grid grid-cols-3 gap-6 mt-16 w-full max-w-lg">
					{[
						{
							icon: "⚡",
							title: "Instant",
							desc: "Short links in under a second",
						},
						{
							icon: "📊",
							title: "Analytics",
							desc: "See how your links perform",
						},
						{
							icon: "◉",
							title: "QR Codes",
							desc: "Auto-generated for every link",
						},
					].map((f) => (
						<div key={f.title} className="text-center">
							<div className="text-2xl mb-2">{f.icon}</div>
							<p className="text-sm font-medium text-[#0D0D0D]">{f.title}</p>
							<p className="text-xs text-[#9B9590] mt-0.5">{f.desc}</p>
						</div>
					))}
				</div>
			</main>
			<footer className="border-t border-[#E8E3DA] py-6 px-6">
				<div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-2">
						<span
							className="text-sm font-semibold text-[#0D0D0D]"
							style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
						>
							snip
						</span>
						<span className="text-xs text-[#C4BFB6]">·</span>
						<span className="text-xs text-[#9B9590]">
							Make links shorter, smarter.
						</span>
					</div>
					<div className="flex items-center gap-5">
						{["Privacy", "Terms", "Contact"].map((l) => (
							<a
								key={l}
								href="#"
								className="text-xs text-[#9B9590] hover:text-[#0D0D0D] transition-colors"
							>
								{l}
							</a>
						))}
					</div>
				</div>
			</footer>
			<AuthModal
				isOpen={authOpen}
				onClose={() => setAuthOpen(false)}
				initialMode={authMode}
			/>
		</div>
	);
};

export default LandingPage;
