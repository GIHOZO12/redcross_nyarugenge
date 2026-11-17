import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "../../Layout/AdminLayout";
import { familyAdminService, getErrorMessage } from "../../api";
import { useFetch } from "../../hooks";

/**
 * Committee view of one family: its parents, its children, and the controls
 * to change both.
 *
 * Only the President, Vice President or Secretary (and staff) can load this -
 * the server decides, and a 403 is shown as a plain message rather than an
 * empty page, so an ordinary member who follows the link understands why.
 */
const FamilyManage = () => {
  const { id } = useParams();

  const {
    data: family,
    loading,
    error,
    refetch,
  } = useFetch(useCallback(() => familyAdminService.detail(id), [id]), [id]);

  const { data: users } = useFetch(familyAdminService.assignableUsers, [], []);

  const [busy, setBusy] = useState(false);
  const [childMode, setChildMode] = useState("account"); // "account" | "manual"
  const [childUserId, setChildUserId] = useState("");
  const [manualChild, setManualChild] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  /** Run a write, then reload so the page always shows server truth. */
  const run = async (action, successTitle) => {
    setBusy(true);
    try {
      const data = await action();
      await refetch();
      Swal.fire(successTitle, data?.message || "", "success");
      return true;
    } catch (err) {
      Swal.fire("Error", getErrorMessage(err), "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const assignParent = (slot, userId) =>
    run(
      () => familyAdminService.assignParent(id, slot, userId || null),
      "Updated"
    );

  const addChild = async (e) => {
    e.preventDefault();
    const payload =
      childMode === "account"
        ? { user_id: childUserId }
        : { ...manualChild };

    if (childMode === "account" && !childUserId) {
      Swal.fire("Pick someone", "Choose a user to add as a child.", "info");
      return;
    }

    const ok = await run(
      () => familyAdminService.addChild(id, payload),
      "Child added"
    );
    if (ok) {
      setChildUserId("");
      setManualChild({ first_name: "", last_name: "", email: "" });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="p-8 text-gray-500">Loading family…</p>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8">
          <p className="bg-red-100 text-red-700 p-4 rounded-lg max-w-xl">{error}</p>
          <Link to="/admin/redcrossfamilies" className="text-blue-700 underline mt-4 inline-block">
            Back to families
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!family) return null;

  const label = (u) =>
    u ? `${u.username}${u.email ? ` — ${u.email}` : ""}` : "Not assigned";

  /** "father of Unity, child of Humanity" — every hat a person already wears. */
  const describePlacements = (u) =>
    (u.placements || []).map((p) => `${p.as} of ${p.family}`).join(", ");

  /**
   * Options for a parent slot.
   *
   * Only being a parent of ANOTHER family disqualifies someone, because
   * father/mother are one-to-one. Being a child elsewhere does not: the same
   * person may be a child of one family and the father of this one.
   */
  const parentOptions = users.map((u) => {
    const alreadyHere = family.father?.id === u.id || family.mother?.id === u.id;
    const blocked = u.is_parent_elsewhere && !alreadyHere;
    const held = describePlacements(u);
    return (
      <option key={u.id} value={u.id} disabled={blocked}>
        {u.username}
        {u.email ? ` (${u.email})` : ""}
        {held ? ` — ${held}` : ""}
        {blocked ? " — already a parent" : ""}
      </option>
    );
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <header className="mb-8">
          <Link to="/admin/redcrossfamilies" className="text-sm text-blue-700 underline">
            ← All families
          </Link>
          <h1 className="text-3xl font-bold text-blue-900 mt-2 capitalize">
            {family.name} family
          </h1>
          <p className="text-gray-600">
            {family.children_count} {family.children_count === 1 ? "child" : "children"}
          </p>
        </header>

        {/* Parents ------------------------------------------------------ */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Parents</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {["father", "mother"].map((slot) => (
              <div key={slot}>
                <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">
                  {slot}
                </label>
                <p className="text-gray-900 mb-2">{label(family[slot])}</p>
                <select
                  disabled={busy}
                  value={family[slot]?.id || ""}
                  onChange={(e) => assignParent(slot, e.target.value)}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="">— Not assigned —</option>
                  {parentOptions}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Their committee role is unchanged. Nobody can be a parent of
                  more than one family.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Children ----------------------------------------------------- */}
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Children</h2>
          {family.children.length === 0 ? (
            <p className="text-gray-500">No children in this family yet.</p>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white text-left">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Account</th>
                </tr>
              </thead>
              <tbody>
                {family.children.map((child) => (
                  <tr key={child.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {child.first_name} {child.last_name}
                    </td>
                    <td className="px-4 py-2">{child.email}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {child.user ? child.user.username : "No account"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Add a child -------------------------------------------------- */}
        <section className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Add a child</h2>

          <div className="flex gap-4 mb-4 text-sm">
            {[
              ["account", "Existing user"],
              ["manual", "No account yet"],
            ].map(([mode, text]) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="childMode"
                  checked={childMode === mode}
                  onChange={() => setChildMode(mode)}
                />
                {text}
              </label>
            ))}
          </div>

          <form onSubmit={addChild} className="space-y-4">
            {childMode === "account" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Choose a registered user
                </label>
                <select
                  value={childUserId}
                  onChange={(e) => setChildUserId(e.target.value)}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="">— Select a user —</option>
                  {users.map((u) => {
                    const held = describePlacements(u);
                    return (
                      <option key={u.id} value={u.id}>
                        {u.username}
                        {u.email ? ` (${u.email})` : ""}
                        {held ? ` — ${held}` : ""}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Their committee role is left as it is — someone can be a child
                  here and still be a parent of another family, or hold an office.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["first_name", "First name"],
                  ["last_name", "Last name"],
                  ["email", "Email"],
                ].map(([key, text]) => (
                  <input
                    key={key}
                    type={key === "email" ? "email" : "text"}
                    placeholder={text}
                    value={manualChild[key]}
                    onChange={(e) =>
                      setManualChild({ ...manualChild, [key]: e.target.value })
                    }
                    className="p-2 border rounded-md"
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="bg-blue-700 hover:bg-blue-900 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded-md"
            >
              {busy ? "Saving…" : "Add child"}
            </button>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
};

export default FamilyManage;
