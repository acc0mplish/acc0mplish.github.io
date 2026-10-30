import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Globe2,
  Search,
} from 'lucide-react';
import { SAMPLE_REVENUE_DATA } from '../../data/componentsData';

export function RevenueBlock() {
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({
    'reg-kr-apac': true,
    'reg-na': false,
    'reg-emea': false,
    'reg-latam': false,
  });
  const [search, setSearch] = useState('');

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredRegions = SAMPLE_REVENUE_DATA.filter((reg) =>
    reg.region.toLowerCase().includes(search.toLowerCase()) ||
    reg.subregions.some((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full text-zinc-900  font-sans">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 border-b border-zinc-200  bg-white ">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900  flex items-center gap-2">
            <Globe2 size={16} className="text-blue-500" />
            <span>글로벌 권역별 매출 현황</span>
          </h2>
          <p className="text-xs text-klic-muted  mt-0.5">
            연간 반복 매출(ARR) 집계 및 권역·지사별 성장률 추이를 확인합니다.
          </p>
        </div>

        {/* 요약 지표 배지 */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-blue-50  text-blue-700  border border-blue-200  font-medium">
            전체 ARR: <strong className="ml-1">₩585억</strong>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-blue-50  text-blue-700  border border-blue-200  font-medium">
            평균 성장률: <strong className="ml-1">+38.4%</strong>
          </span>
        </div>
      </div>

      {/* 검색 바 */}
      <div className="p-3 sm:px-6 border-b border-zinc-200  bg-zinc-50/50  flex items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-klic-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="권역 또는 지사명 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-white  border border-zinc-200  rounded-lg text-xs placeholder:text-klic-muted focus:outline-none"
          />
        </div>
        <div className="text-xs text-klic-muted">총 4개 글로벌 권역</div>
      </div>

      {/* 계층형 데이터 그리드 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200  bg-zinc-100/60  text-klic-muted font-medium">
              <th className="py-2.5 px-4 font-semibold">권역 / 하위 지사</th>
              <th className="py-2.5 px-4 font-semibold">ARR 매출 규모</th>
              <th className="py-2.5 px-4 font-semibold">전년 대비 성장률</th>
              <th className="py-2.5 px-4 font-semibold">활성 고객사 수</th>
              <th className="py-2.5 px-4 font-semibold">총괄 리드</th>
              <th className="py-2.5 px-4 font-semibold text-right">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 ">
            {filteredRegions.map((reg) => {
              const isExpanded = expandedRegions[reg.id];

              return (
                <React.Fragment key={reg.id}>
                  {/* 권역 상위 행 */}
                  <tr
                    onClick={() => toggleRegion(reg.id)}
                    className="hover:bg-zinc-50  cursor-pointer font-medium bg-white  transition"
                  >
                    <td className="py-3 px-4 flex items-center gap-2 text-zinc-900  font-semibold">
                      <span className="text-klic-muted">
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                      <span>{reg.region}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100  text-klic-muted font-normal">
                        {reg.subregions.length}개 지사
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-900 ">
                      {reg.arr}
                    </td>
                    <td className="py-3 px-4 text-blue-600  font-medium">
                      {reg.growth}
                    </td>
                    <td className="py-3 px-4 text-klic-muted  font-mono">
                      {reg.accounts.toLocaleString()}개사
                    </td>
                    <td className="py-3 px-4 text-zinc-700 ">
                      {reg.csmLead}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-50  text-blue-700  border border-blue-200 ">
                        {reg.status}
                      </span>
                    </td>
                  </tr>

                  {/* 하위 지사 행 */}
                  {isExpanded &&
                    reg.subregions.map((sub) => (
                      <tr
                        key={sub.id}
                        className="bg-zinc-50/50  hover:bg-zinc-100/50  text-klic-muted  transition"
                      >
                        <td className="py-2.5 px-4 pl-10 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 " />
                          <span className="text-zinc-800 ">{sub.name}</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono">{sub.arr}</td>
                        <td className="py-2.5 px-4 text-blue-600 ">
                          {sub.growth}
                        </td>
                        <td className="py-2.5 px-4 font-mono">{sub.accounts.toLocaleString()}개사</td>
                        <td className="py-2.5 px-4 text-klic-muted">지역 전담팀</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[10px] text-klic-muted">지사 할당</span>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
