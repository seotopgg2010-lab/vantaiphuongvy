'use client';

import { useEffect, useState } from 'react';
import { createStaff, deleteStaff, listStaff, updateStaff } from './actions';

type Staff = Awaited<ReturnType<typeof listStaff>>[number];
const permissionOptions = [
  ['content.read', 'Nội dung: xem'], ['content.write', 'Nội dung: thêm/sửa'], ['content.delete', 'Nội dung: xóa'],
  ['contacts.read', 'Liên hệ: xem'], ['contacts.manage', 'Liên hệ: quản lý'], ['settings.manage', 'Cài đặt'],
];

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [role, setRole] = useState('editor'); const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState(''); const [editing, setEditing] = useState<Staff | null>(null);
  async function refresh() { try { setStaff(await listStaff()); } catch (error) { setStatus(error instanceof Error ? error.message : 'Không tải được nhân viên.'); } }
  useEffect(() => { const timer = window.setTimeout(() => void refresh(), 0); return () => window.clearTimeout(timer); }, []);
  function toggle(permission: string) { setSelected((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]); }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setStatus('Đang lưu...'); const data = new FormData(); data.set('email', email); data.set('password', password); data.set('role', role); data.set('permissions', selected.join(','));
    const result = editing ? await updateStaff(editing.id, data) : await createStaff(data); setStatus(result.success ? 'Đã lưu tài khoản.' : `Lỗi: ${result.error}`);
    if (result.success) { setEmail(''); setPassword(''); setRole('editor'); setSelected([]); setEditing(null); await refresh(); }
  }
  function edit(user: Staff) { setEditing(user); setEmail(user.email); setRole(user.role === 'admin' ? 'editor' : user.role); setSelected(user.permissions); setPassword(''); }
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold text-[#1F2522]">Quản lý nhân viên</h1><p className="mt-1 text-sm text-gray-500">Tạo, sửa, phân quyền và xóa tài khoản vận hành. Tài khoản admin chính không thể bị sửa/xóa tại đây.</p></div>
    <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"><h2 className="font-semibold">{editing ? 'Sửa tài khoản' : 'Thêm nhân viên'}</h2><div className="grid gap-3 md:grid-cols-3"><label className="text-sm">Email<input type="email" required disabled={!!editing} value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" /></label><label className="text-sm">Mật khẩu {editing && '(bỏ trống nếu giữ nguyên)'}<input type="password" required={!editing} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border p-2.5" /></label><label className="text-sm">Vai trò<select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg border p-2.5"><option value="editor">Biên tập viên</option><option value="support">Chăm sóc khách hàng</option></select></label></div><fieldset><legend className="mb-2 text-sm font-medium">Quyền bổ sung</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{permissionOptions.map(([value, label]) => <label key={value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(value)} onChange={() => toggle(value)} />{label}</label>)}</div></fieldset><div className="flex gap-3"><button disabled={status === 'Đang lưu...'} className="rounded-lg bg-[#2B7935] px-5 py-2.5 font-medium text-white disabled:opacity-60">{editing ? 'Cập nhật' : 'Tạo nhân viên'}</button>{editing && <button type="button" onClick={() => { setEditing(null); setEmail(''); setPassword(''); setSelected([]); }} className="rounded-lg border px-5 py-2.5">Hủy</button>}<span aria-live="polite" className="self-center text-sm text-gray-500">{status}</span></div></form>
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Email</th><th className="p-4">Vai trò</th><th className="p-4">Đăng nhập cuối</th><th className="p-4">Thao tác</th></tr></thead><tbody>{staff.map((user) => <tr key={user.id} className="border-t"><td className="p-4">{user.email}</td><td className="p-4">{user.role}</td><td className="p-4">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('vi-VN') : 'Chưa đăng nhập'}</td><td className="flex gap-2 p-4"><button disabled={user.role === 'admin'} onClick={() => edit(user)} className="rounded border px-3 py-1.5">Sửa</button><button disabled={user.role === 'admin'} onClick={async () => { if (!window.confirm(`Xóa ${user.email}?`)) return; const result = await deleteStaff(user.id); setStatus(result.success ? 'Đã xóa.' : `Lỗi: ${result.error}`); if (result.success) await refresh(); }} className="rounded border border-red-200 px-3 py-1.5 text-red-700">Xóa</button></td></tr>)}</tbody></table></div>
  </div>;
}
