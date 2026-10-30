import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowDownToLine,
} from 'lucide-react';
import { SAMPLE_BILLING_TRANSACTIONS } from '../../data/componentsData';

export function BillingBlock() {
  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_BILLING_TRANSACTIONS.filter((tx) => {
    const matchStatus = filterStatus === '전체' || tx.status === filterStatus;
    const matchSearch =
      tx.customer.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="w-full text-zinc-900  font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 border-b border-zinc-200  bg-white ">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900  flex items-center gap-2">
            <CreditCard size={16} className="text-blue-500" />
            <span>결제 및 청구 내역 감사</span>
          </h2>
          <p className="text-xs text-klic-muted  mt-0.5">
            법인카드 자동 결제, 가상계좌 이체 및 전자세금계산서 정산 내역을 필터링합니다.
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium hover:bg-zinc-50  transition">
          <ArrowDownToLine size={13} />
          <span>CSV 내보내기</span>
        </button>
      </div>

      {/* 필터 툴바 */}
      <div className="p-3 sm:px-6 border-b border-zinc-200  bg-zinc-50/50  flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="거래 번호 또는 고객사명 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-white  border border-zinc-200  rounded-lg text-xs placeholder:text-klic-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {(['전체', '결제 완료', '처리 대기', '결제 실패'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md transition ${
                filterStatus === st
                  ? 'bg-klic-inverse  text-klic-on-emphasis  font-semibold shadow-2xs'
                  : 'text-klic-muted  hover:bg-zinc-200/50 '
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 거래 내역 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200  bg-zinc-100/60  text-klic-muted font-medium">
              <th className="py-2.5 px-4 font-semibold">거래 번호</th>
              <th className="py-2.5 px-4 font-semibold">고객사 계정</th>
              <th className="py-2.5 px-4 font-semibold">결제 일시</th>
              <th className="py-2.5 px-4 font-semibold">청구 금액</th>
              <th className="py-2.5 px-4 font-semibold">결제 수단</th>
              <th className="py-2.5 px-4 font-semibold text-right">정산 상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 ">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-zinc-50/70  bg-white  transition"
              >
                <td className="py-2.5 px-4 font-mono font-medium text-zinc-900 ">
                  {item.id}
                </td>
                <td className="py-2.5 px-4 font-semibold text-zinc-800 ">
                  {item.customer}
                </td>
                <td className="py-2.5 px-4 text-klic-muted">{item.date}</td>
                <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900 ">
                  {item.amount}
                </td>
                <td className="py-2.5 px-4 text-klic-muted ">
                  {item.method}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      item.status === '결제 완료'
                        ? 'bg-blue-50  text-blue-700  border border-blue-200 '
                        : item.status === '처리 대기'
                        ? 'bg-amber-50  text-amber-700  border border-amber-200 '
                        : 'bg-blue-50  text-blue-700  border border-blue-200 '
                    }`}
                  >
                    {item.status === '결제 완료' && <CheckCircle size={10} />}
                    {item.status === '처리 대기' && <Clock size={10} />}
                    {item.status === '결제 실패' && <AlertTriangle size={10} />}
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
