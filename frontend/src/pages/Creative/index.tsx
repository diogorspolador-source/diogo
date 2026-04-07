import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLaunchStore } from '../../store/launchStore';
import { generateApi } from '../../api/generate';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';
import { CopyBlock } from '../../components/copy/CopyBlock';
import { ImageCanvas } from '../../components/canvas/ImageCanvas';
import { ExportButton } from '../../components/canvas/ExportButton';
import { MetaAd1080x1080 } from '../../components/canvas/templates/MetaAd1080x1080';
import { MetaAd1080x1920 } from '../../components/canvas/templates/MetaAd1080x1920';
import { YoutubeThumbnail } from '../../components/canvas/templates/YoutubeThumbnail';
import type { AdCopyVariant, LandingPageCopy, SalesPageCopy } from '../../types/launch';
import type { TemplateData } from '../../components/canvas/CanvasRenderer';

function parseJSON<T>(text: string): T | null {
  // Try to extract JSON from the text (Claude might return extra explanation)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}

function formatAdCopy(variant: AdCopyVariant): string {
  return `[${variant.format.toUpperCase()}] ${variant.headline}\n\n${variant.primaryText}\n\nCTA: ${variant.cta}`;
}

interface MetaAdsCopyData {
  captacao: AdCopyVariant[];
  perpetual: AdCopyVariant[];
}

export default function CreativePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { launches, generatedAssets, setGeneratedAssets } = useLaunchStore();

  const launch = launches.find((l) => l.id === id);

  const [streaming, setStreaming] = useState<Record<string, boolean>>({});
  const [rawText, setRawText] = useState<Record<string, string>>({});
  const [genError, setGenError] = useState<Record<string, string>>({});

  const assets = id ? (generatedAssets[id] ?? { launchId: id ?? '' }) : { launchId: '' };

  const abortRef = useRef<Record<string, boolean>>({});

  if (!launch) {
    return (
      <div className="page">
        <div className="empty-state">
          <h3>Lançamento não encontrado</h3>
          <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const templateData: TemplateData = {
    headline: assets.youtubeThumbnailText?.headline ?? launch.usp,
    subheadline: assets.youtubeThumbnailText?.subheadline,
    instructorName: launch.instructorName,
    liveDate: new Date(launch.liveDate + 'T00:00:00').toLocaleDateString('pt-BR'),
    liveTime: launch.liveTime,
    courseName: launch.name,
  };

  const startGeneration = (
    key: string,
    generatorFn: (
      launchId: string,
      onDelta: (text: string) => void,
      onDone: (fullText: string) => void,
      onError: (msg: string) => void,
    ) => Promise<void>,
    onDone: (fullText: string) => void,
  ) => {
    setStreaming((prev) => ({ ...prev, [key]: true }));
    setRawText((prev) => ({ ...prev, [key]: '' }));
    setGenError((prev) => ({ ...prev, [key]: '' }));
    abortRef.current[key] = false;

    generatorFn(
      launch.id,
      (text) => {
        if (abortRef.current[key]) return;
        setRawText((prev) => ({ ...prev, [key]: (prev[key] ?? '') + text }));
      },
      (fullText) => {
        setStreaming((prev) => ({ ...prev, [key]: false }));
        setRawText((prev) => ({ ...prev, [key]: fullText }));
        onDone(fullText);
      },
      (msg) => {
        setStreaming((prev) => ({ ...prev, [key]: false }));
        setGenError((prev) => ({ ...prev, [key]: msg }));
      },
    ).catch((err) => {
      setStreaming((prev) => ({ ...prev, [key]: false }));
      setGenError((prev) => ({ ...prev, [key]: err.message ?? 'Erro inesperado' }));
    });
  };

  const generateMetaAds = () => {
    startGeneration('metaAds', generateApi.metaAdsCopy, (fullText) => {
      const parsed = parseJSON<MetaAdsCopyData>(fullText);
      if (parsed) {
        setGeneratedAssets(launch.id, { metaAdsCopy: parsed });
      }
    });
  };

  const generateLandingPage = () => {
    startGeneration('landingPage', generateApi.landingPageCopy, (fullText) => {
      const parsed = parseJSON<LandingPageCopy>(fullText);
      if (parsed) {
        setGeneratedAssets(launch.id, { landingPageCopy: parsed });
      }
    });
  };

  const generateSalesPage = () => {
    startGeneration('salesPage', generateApi.salesPageCopy, (fullText) => {
      const parsed = parseJSON<SalesPageCopy>(fullText);
      if (parsed) {
        setGeneratedAssets(launch.id, { salesPageCopy: parsed });
      }
    });
  };

  const generateYoutube = () => {
    startGeneration('youtube', generateApi.youtubeThumbnail, (fullText) => {
      const parsed = parseJSON<{ headline: string; subheadline: string }>(fullText);
      if (parsed) {
        setGeneratedAssets(launch.id, { youtubeThumbnailText: parsed });
      }
    });
  };

  // ---- Tab: Meta Ads Copy ----
  const MetaAdsTab = (
    <div className="tab-content">
      <div className="tab-generate-bar">
        <p className="tab-desc">
          Gere copies persuasivos para anúncios no Facebook e Instagram — 5 variações para captação e 3 para campanha perpétua.
        </p>
        <Button
          onClick={generateMetaAds}
          loading={streaming['metaAds']}
        >
          {assets.metaAdsCopy ? 'Regenerar Copies' : 'Gerar Copies com IA'}
        </Button>
      </div>

      {genError['metaAds'] && (
        <div className="alert alert--error">{genError['metaAds']}</div>
      )}

      {(streaming['metaAds'] || rawText['metaAds']) && !assets.metaAdsCopy && (
        <Card title="Gerando copies...">
          <CopyBlock
            title="Streaming"
            content={rawText['metaAds'] ?? ''}
            isStreaming={streaming['metaAds']}
          />
        </Card>
      )}

      {assets.metaAdsCopy && (
        <div className="copy-sections">
          <h3 className="copy-section-title">Fase de Captação</h3>
          {assets.metaAdsCopy.captacao.map((variant) => (
            <CopyBlock
              key={variant.id}
              title={`${variant.format.toUpperCase()} — Captação`}
              content={formatAdCopy(variant)}
              onRegenerate={generateMetaAds}
            />
          ))}
          <h3 className="copy-section-title">Campanha Perpétua</h3>
          {assets.metaAdsCopy.perpetual.map((variant) => (
            <CopyBlock
              key={variant.id}
              title={`${variant.format.toUpperCase()} — Perpétuo`}
              content={formatAdCopy(variant)}
              onRegenerate={generateMetaAds}
            />
          ))}
        </div>
      )}
    </div>
  );

  // ---- Tab: Images ----
  const ImagesTab = (
    <div className="tab-content">
      <div className="tab-generate-bar">
        <p className="tab-desc">
          Pré-visualize e exporte os criativos em diferentes formatos. Os textos são baseados na USP e nos dados do lançamento.
        </p>
        <Button onClick={generateYoutube} loading={streaming['youtube']}>
          Gerar Texto para Thumbnails
        </Button>
      </div>

      {genError['youtube'] && (
        <div className="alert alert--error">{genError['youtube']}</div>
      )}

      {assets.youtubeThumbnailText && (
        <div className="canvas-text-preview">
          <p><strong>Headline:</strong> {assets.youtubeThumbnailText.headline}</p>
          <p><strong>Subheadline:</strong> {assets.youtubeThumbnailText.subheadline}</p>
        </div>
      )}

      <div className="canvas-grid">
        <div className="canvas-item">
          <div className="canvas-item-header">
            <h4>Meta Ad — Feed 1:1</h4>
            <span className="canvas-size">1080 × 1080</span>
            <ExportButton
              template={MetaAd1080x1080}
              data={templateData}
              filename={`${launch.name}-feed-1080`}
            />
          </div>
          <div className="canvas-wrapper">
            <ImageCanvas template={MetaAd1080x1080} data={templateData} scale={0.28} />
          </div>
        </div>

        <div className="canvas-item">
          <div className="canvas-item-header">
            <h4>Meta Ad — Story 9:16</h4>
            <span className="canvas-size">1080 × 1920</span>
            <ExportButton
              template={MetaAd1080x1920}
              data={templateData}
              filename={`${launch.name}-story-1080`}
            />
          </div>
          <div className="canvas-wrapper">
            <ImageCanvas template={MetaAd1080x1920} data={templateData} scale={0.22} />
          </div>
        </div>

        <div className="canvas-item canvas-item--wide">
          <div className="canvas-item-header">
            <h4>YouTube Thumbnail</h4>
            <span className="canvas-size">1280 × 720</span>
            <ExportButton
              template={YoutubeThumbnail}
              data={templateData}
              filename={`${launch.name}-youtube`}
            />
          </div>
          <div className="canvas-wrapper">
            <ImageCanvas template={YoutubeThumbnail} data={templateData} scale={0.35} />
          </div>
        </div>
      </div>
    </div>
  );

  // ---- Tab: Landing Page ----
  const LandingPageTab = (
    <div className="tab-content">
      <div className="tab-generate-bar">
        <p className="tab-desc">
          Gere o copy completo para sua página de captura de leads para a aula ao vivo gratuita.
        </p>
        <Button onClick={generateLandingPage} loading={streaming['landingPage']}>
          {assets.landingPageCopy ? 'Regenerar' : 'Gerar Landing Page'}
        </Button>
      </div>

      {genError['landingPage'] && (
        <div className="alert alert--error">{genError['landingPage']}</div>
      )}

      {streaming['landingPage'] && !assets.landingPageCopy && (
        <Card title="Gerando...">
          <CopyBlock title="Streaming" content={rawText['landingPage'] ?? ''} isStreaming />
        </Card>
      )}

      {assets.landingPageCopy && (
        <div className="copy-sections">
          <CopyBlock
            title="Headline"
            content={assets.landingPageCopy.headline}
            onRegenerate={generateLandingPage}
          />
          <CopyBlock
            title="Subheadline"
            content={assets.landingPageCopy.subheadline}
            onRegenerate={generateLandingPage}
          />
          <CopyBlock
            title="Benefícios"
            content={assets.landingPageCopy.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}
            onRegenerate={generateLandingPage}
          />
          <CopyBlock
            title="Sobre o Instrutor"
            content={assets.landingPageCopy.aboutInstructor}
            onRegenerate={generateLandingPage}
          />
          <CopyBlock
            title="CTA do Botão"
            content={assets.landingPageCopy.ctaText}
            onRegenerate={generateLandingPage}
          />
        </div>
      )}
    </div>
  );

  // ---- Tab: Sales Page ----
  const SalesPageTab = (
    <div className="tab-content">
      <div className="tab-generate-bar">
        <p className="tab-desc">
          Gere o copy completo da página de vendas do curso, incluindo headline, benefícios, bônus, garantia e FAQ.
        </p>
        <Button onClick={generateSalesPage} loading={streaming['salesPage']}>
          {assets.salesPageCopy ? 'Regenerar' : 'Gerar Página de Vendas'}
        </Button>
      </div>

      {genError['salesPage'] && (
        <div className="alert alert--error">{genError['salesPage']}</div>
      )}

      {streaming['salesPage'] && !assets.salesPageCopy && (
        <Card title="Gerando...">
          <CopyBlock title="Streaming" content={rawText['salesPage'] ?? ''} isStreaming />
        </Card>
      )}

      {assets.salesPageCopy && (() => {
        const sp = assets.salesPageCopy;
        return (
          <div className="copy-sections">
            <CopyBlock title="Headline Principal" content={sp.headline} onRegenerate={generateSalesPage} />
            <CopyBlock title="Subheadline" content={sp.subheadline} onRegenerate={generateSalesPage} />
            <CopyBlock title="Declaração do Problema" content={sp.problemStatement} onRegenerate={generateSalesPage} />
            <CopyBlock title="Apresentação da Solução" content={sp.solution} onRegenerate={generateSalesPage} />
            <CopyBlock
              title="Benefícios"
              content={sp.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}
              onRegenerate={generateSalesPage}
            />
            <CopyBlock title="Seção de Bônus" content={sp.bonusSection} onRegenerate={generateSalesPage} />
            <CopyBlock title="Precificação" content={sp.priceSection} onRegenerate={generateSalesPage} />
            <CopyBlock title="Garantia" content={sp.guarantee} onRegenerate={generateSalesPage} />
            <CopyBlock
              title="FAQ"
              content={sp.faq.map((f) => `P: ${f.question}\nR: ${f.answer}`).join('\n\n')}
              onRegenerate={generateSalesPage}
            />
            <CopyBlock title="CTA Principal" content={sp.ctaText} onRegenerate={generateSalesPage} />
            {sp.testimonialPlaceholders.length > 0 && (
              <CopyBlock
                title="Sugestões de Depoimentos"
                content={sp.testimonialPlaceholders.map((t, i) => `Depoimento ${i + 1}: ${t}`).join('\n\n')}
              />
            )}
          </div>
        );
      })()}
    </div>
  );

  const tabs = [
    { id: 'meta-ads', label: 'Anúncios Meta', content: MetaAdsTab },
    { id: 'images', label: 'Imagens', content: ImagesTab },
    { id: 'landing', label: 'Landing Page', content: LandingPageTab },
    { id: 'sales', label: 'Página de Vendas', content: SalesPageTab },
  ];

  return (
    <div className="page">
      <PageHeader
        title={launch.name}
        subtitle={`Criativos e copies para o lançamento — ${new Date(launch.liveDate + 'T00:00:00').toLocaleDateString('pt-BR')} às ${launch.liveTime} no ${launch.livePlatform}`}
        actions={
          <Button variant="secondary" onClick={() => navigate(`/launches/${id}/edit`)}>
            Editar Lançamento
          </Button>
        }
      />

      <Tabs tabs={tabs} defaultTab="meta-ads" />
    </div>
  );
}
