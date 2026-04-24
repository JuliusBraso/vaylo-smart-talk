import Link from "next/link";
import { getServerLocaleAndDict } from "@/lib/i18n/get-server-dict";
import { getFormCatalogCopy, getForms } from "@/lib/vaylo/forms-engine";

export default async function Page() {
  const { t } = await getServerLocaleAndDict();
  const forms = getForms();

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <div className="text-base font-semibold text-slate-900">{t.nav.forms}</div>
            <div className="mt-1 text-sm text-slate-600">{t.forms.shellSubtitle}</div>
          </div>

          <div className="grid gap-4">
            {forms.map((form) => {
              const copy = getFormCatalogCopy(form.id, t);
              return (
                <div
                  key={form.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-slate-900">
                        {copy.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {copy.shortDescription}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {t.categoryLabels[form.category]}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {form.authority ?? t.forms.unknownAuthority}
                    </span>
                  </div>

                  <Link
                    href={`/forms/${form.slug}`}
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200/70"
                    style={{ textDecoration: "none" }}
                  >
                    {t.forms.openForm}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
