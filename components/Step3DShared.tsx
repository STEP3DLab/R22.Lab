"use client";
import { type ElementType, type ReactNode } from "react";

export const TG_CHANNEL_URL = "https://t.me/STEP_3D_Lab";

export function cx(...classes:(string|false|undefined|null)[]){
  return classes.filter(Boolean).join(" ");
}

export const fmtDate = (iso:string) => new Date(iso).toLocaleDateString();

export function tgShareLink({ url, text }:{ url:string; text?:string }){
  const u = new URL("https://t.me/share/url");
  u.searchParams.set("url", url);
  if(text) u.searchParams.set("text", text);
  return u.toString();
}

export type ButtonProps<T extends ElementType = 'button'> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Button<T extends ElementType = 'button'>({ as, className, children, ...props }: ButtonProps<T>) {
  const Tag = (as || 'button') as ElementType;
  return (
    <Tag className={cx('btn', className)} {...props}>{children}</Tag>
  );
}

export function Badge({ children }:{ children: ReactNode }){
  return <span className="badge">{children}</span>;
}

export function Section({ id, title, subtitle, children }:{ id:string; title:string; subtitle?:string; children:ReactNode }){
  return (
    <section id={id} className="border-t border-black bg-white">
      <div className="container px-4 py-16">
        <header className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-3 content text-base text-neutral-700 leading-relaxed">{subtitle}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
