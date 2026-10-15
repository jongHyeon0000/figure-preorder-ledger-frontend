import { useState } from 'react';
import type { FigureSummary } from '@/app/figure/interface/FigureSummary';

/**
 * 상품 목록의 선택 모드 상태 훅. 모드 켜고 끄기와 체크만 맡고 화면은 그리지 않는다.
 * 탭이나 필터를 바꿔 안 보이게 된 상품은 체크했어도 checkedIds 에서 빠진다.
 *
 * @param shownFigures 지금 화면에 보이는 상품
 */
const useFigureSelection = (shownFigures: FigureSummary[]) => {
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const checkedIds = shownFigures.filter((figure) => selectedIds.includes(figure.figureId)).map((figure) => figure.figureId);

  const startSelectMode = () => setSelectMode(true);

  const toggleFigure = (figureId: number) => {
    setSelectedIds((prev) => (prev.includes(figureId) ? prev.filter((id) => id !== figureId) : [...prev, figureId]));
  };

  /* 보이는 상품이 전부 체크돼 있으면 모두 해제하고, 아니면 전부 체크한다 */
  const toggleAllFigures = () => {
    setSelectedIds(checkedIds.length === shownFigures.length ? [] : shownFigures.map((figure) => figure.figureId));
  };

  const cancelSelectMode = () => {
    setSelectMode(false);
    setSelectedIds([]);
  };

  return { selectMode, checkedIds, startSelectMode, toggleFigure, toggleAllFigures, cancelSelectMode };
};

export default useFigureSelection;
