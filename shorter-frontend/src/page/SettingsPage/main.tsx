import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../hooks";
import { Spinner, Card, Input, Button, Toggle} from "../../ui/components";
const SettingsPage = () => {
  const { settings, isLoading, isSaving, update } = useSettings();
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const handleProfile = async (e:any) => {
    e.preventDefault();
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div className="max-w-xl mx-auto px-6 py-8 w-full">
      <div className="mb-7">
        <h1
          className="text-2xl font-semibold text-[#0D0D0D] tracking-tight"
          style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
        >
          Settings
        </h1>
        <p className="text-sm text-[#9B9590] mt-1">
          Manage your account and preferences.
        </p>
      </div>
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-[#9B9590] uppercase tracking-wider mb-3">
          Profile
        </h2>
        <Card>
          <form onSubmit={handleProfile} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0D0D0D] rounded-full flex items-center justify-center text-[#F5F0E8] font-semibold text-lg">
                {name
                  ? name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "??"}
              </div>
              <div>
                <p className="text-sm font-medium text-[#0D0D0D]">
                  {user?.plan === "pro" ? "⭐ Pro" : "Free plan"}
                </p>
                <p className="text-xs text-[#9B9590]">
                  Member since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" size="sm" isLoading={isSaving}>
                {saved ? "✓ Saved" : "Save changes"}
              </Button>
              <Button type="button" variant="secondary" size="sm">
                Change password
              </Button>
            </div>
          </form>
        </Card>
      </section>
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-[#9B9590] uppercase tracking-wider mb-3">
          Link Preferences
        </h2>
        <Card className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[#4A4540] uppercase tracking-wider block mb-1.5">
              Default domain
            </label>
            <select
              value={settings?.defaultDomain}
              onChange={(e) => update({ defaultDomain: e.target.value })}
              className="w-full bg-white border border-[#D4CFC6] rounded-lg px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#0D0D0D] cursor-pointer pr-8"
            >
              <option value="snip.ly">snip.ly</option>
              <option value="s.snip.ly">s.snip.ly</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#4A4540] uppercase tracking-wider block mb-2">
              QR Code style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["square", "rounded", "dots"].map((s) => (
                <button
                  key={s}
                  onClick={() => update({ qrStyle: s })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize cursor-pointer ${settings?.qrStyle === s ? "bg-[#0D0D0D] text-[#F5F0E8] border-[#0D0D0D]" : "bg-white text-[#6B6560] border-[#D4CFC6] hover:border-[#0D0D0D]"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-[#9B9590] uppercase tracking-wider mb-3">
          Notifications
        </h2>
        <Card className="flex flex-col divide-y divide-[#F0EBE3]">
          {[
            {
              key: "emailNotifications",
              label: "Email notifications",
              desc: "Alerts for link activity",
            },
            {
              key: "weeklyReport",
              label: "Weekly report",
              desc: "Summary of your link stats",
            },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm text-[#0D0D0D] font-medium">{label}</p>
                <p className="text-xs text-[#9B9590]">{desc}</p>
              </div>
              <Toggle
                on={settings?.[key] ?? false}
                onChange={(v) => update({ [key]: v })}
              />
            </div>
          ))}
        </Card>
      </section>
      <section>
        <h2 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3">
          Danger Zone!!
        </h2>
        <Card className="border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#0D0D0D]">
                Delete account
              </p>
              <p className="text-xs text-[#9B9590]">
                Permanently remove your account and all data.
              </p>
            </div>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default SettingsPage;
