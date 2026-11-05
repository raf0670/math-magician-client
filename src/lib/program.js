"use client";
import { usePathname } from 'next/navigation';
export function useProgram() {
  const pathname = usePathname() || '';
  const isFullLength = pathname.startsWith('/dashboard/full-length-mocks');
  const program = !isFullLength && (pathname.startsWith('/dashboard/math') || pathname.startsWith('/dashboard/admin/math')) ? 'math' : 'general';
  return {
    program,
    isFullLength,
    examBasePath: isFullLength ? '/dashboard/full-length-mocks' : program === 'math' ? '/dashboard/math/live-exams' : '/dashboard/live-exams',
    adminExamPath: program === 'math' ? '/dashboard/admin/math/live-exams' : '/dashboard/admin/live-exams'
  };
}
