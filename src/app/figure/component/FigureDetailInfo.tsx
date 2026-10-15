import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import FigureCategoryChip from '@/app/figure/component/FigureCategoryChip';
import { InfoChips, InfoGroup, InfoRow } from '@/app/figure/component/FigureInfo.style';
import type { FigureDetail } from '@/app/figure/interface/FigureDetail';
import type { FigureFormOptions } from '@/app/figure/interface/FigureFormOptions';
import { findItemThumbnail } from '@/app/figure/utils/FigureUtils';
import { ColumnCard } from '@/app/common/style/CommonCard.style';
import { LabelText } from '@/app/common/style/CommonText.style';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FigureDetailInfoProps {
  /** 보여 줄 상품 */
  figure: FigureDetail;

  /** 분류 썸네일을 찾을 선택지 */
  options: FigureFormOptions;
}

/**
 * 상품 정보 구역. 이름, 분류(장르·캐릭터, 형태, 판매처, 제조사, 시리즈), 구매 링크(표시 전용).
 * 장르는 캐릭터의 상위라서 상품 응답의 캐릭터에서 이름을 가져온다.
 */
const FigureDetailInfo = ({ figure, options }: FigureDetailInfoProps) => {
  const genre = options.genres.find((group) => group.id === figure.characters[0].groupId)!;

  return (
    <ColumnCard>
      <FigureName variant="h5" component="h2">
        {figure.name}
      </FigureName>

      <InfoGroup>
        <InfoRow>
          <LabelText>장르</LabelText>
          <InfoChips>
            <FigureCategoryChip name={genre.name} thumbnailUrl={genre.thumbnailUrl} />
          </InfoChips>
        </InfoRow>
        <InfoRow>
          <LabelText>캐릭터</LabelText>
          <InfoChips>
            {figure.characters.map((character) => (
              <FigureCategoryChip
                key={character.id}
                name={character.name}
                thumbnailUrl={findItemThumbnail(options.genres, character.id)}
              />
            ))}
          </InfoChips>
        </InfoRow>
      </InfoGroup>

      <InfoGroup>
        <InfoRow>
          <LabelText>형태</LabelText>
          <InfoChips>
            <FigureCategoryChip
              name={figure.figureType.name}
              groupName={figure.figureType.groupName}
              thumbnailUrl={findItemThumbnail(options.types, figure.figureType.id)}
            />
          </InfoChips>
        </InfoRow>
      </InfoGroup>

      <InfoGroup>
        <InfoRow>
          <LabelText>판매처</LabelText>
          <InfoChips>
            <FigureCategoryChip
              name={figure.shop.name}
              groupName={figure.shop.groupName}
              thumbnailUrl={findItemThumbnail(options.shops, figure.shop.id)}
            />
          </InfoChips>
        </InfoRow>
      </InfoGroup>

      <InfoGroup>
        <InfoRow>
          <LabelText>제조사</LabelText>
          <InfoChips>
            <FigureCategoryChip
              name={figure.maker.name}
              thumbnailUrl={options.makers.find((maker) => maker.id === figure.maker.id)!.thumbnailUrl}
            />
          </InfoChips>
        </InfoRow>
      </InfoGroup>

      <InfoGroup>
        <InfoRow>
          <LabelText>시리즈</LabelText>
          <InfoChips>
            {figure.series.map((series) => (
              <FigureCategoryChip
                key={series.id}
                name={series.name}
                thumbnailUrl={findItemThumbnail(options.series, series.id)}
              />
            ))}
          </InfoChips>
        </InfoRow>
      </InfoGroup>

      <PurchaseLink href={figure.purchaseLink} target="_blank" rel="noopener noreferrer">
        <LinkOutlinedIcon fontSize="small" color="disabled" />
        <LinkText noWrap color="text.secondary">
          {figure.purchaseLink}
        </LinkText>
        <LinkAction>
          구매 페이지 열기
          <OpenInNewOutlinedIcon fontSize="inherit" />
        </LinkAction>
      </PurchaseLink>
    </ColumnCard>
  );
};

export default FigureDetailInfo;

/* ───────── styles ───────── */

const FigureName = styled(Typography)({
  fontSize: '1.625rem',
}) as typeof Typography;

/* 구매 링크 띠. 카드가 길어져도 맨 아래에 붙는다 */
const PurchaseLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginTop: 'auto',
  padding: theme.spacing(1.25, 2),
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: 12,
  '&:hover': { borderColor: theme.palette.primary.main },
}));

const LinkText = styled(Typography)({
  flex: 1,
  minWidth: 0,
}) as typeof Typography;

const LinkAction = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.primary.main,
  fontWeight: 700,
  whiteSpace: 'nowrap',
}));
