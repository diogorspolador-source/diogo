import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLaunchStore } from '../../store/launchStore';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import type { LaunchFormData } from '../../types/launch';

const PLATFORM_OPTIONS = [
  { value: 'YouTube', label: 'YouTube' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Zoom', label: 'Zoom' },
];

const defaultForm: LaunchFormData = {
  name: '',
  description: '',
  targetAudience: '',
  usp: '',
  price: 0,
  originalPrice: undefined,
  captacaoStart: '',
  captacaoEnd: '',
  liveDate: '',
  liveTime: '',
  livePlatform: 'YouTube',
  instructorName: 'Diogo Spolador',
  instructorBio: '',
  bonuses: [],
  guarantee: '',
  metaCampaignId: '',
};

export default function LaunchFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id && id !== 'new');

  const { launches, createLaunch, updateLaunch, loading, error, clearError } = useLaunchStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<LaunchFormData>(defaultForm);
  const [bonusInput, setBonusInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const launch = launches.find((l) => l.id === id);
      if (launch) {
        const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = launch;
        setForm({ ...rest, originalPrice: rest.originalPrice ?? undefined });
      }
    }
  }, [isEditing, id, launches]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const addBonus = () => {
    if (bonusInput.trim()) {
      setForm((prev) => ({ ...prev, bonuses: [...prev.bonuses, bonusInput.trim()] }));
      setBonusInput('');
    }
  };

  const removeBonus = (index: number) => {
    setForm((prev) => ({ ...prev, bonuses: prev.bonuses.filter((_, i) => i !== index) }));
  };

  const validate = (): boolean => {
    if (!form.name.trim()) { setFormError('Nome do curso é obrigatório'); return false; }
    if (!form.description.trim()) { setFormError('Descrição é obrigatória'); return false; }
    if (!form.targetAudience.trim()) { setFormError('Público-alvo é obrigatório'); return false; }
    if (!form.usp.trim()) { setFormError('Proposta única de valor é obrigatória'); return false; }
    if (!form.price || form.price <= 0) { setFormError('Preço deve ser maior que zero'); return false; }
    if (!form.captacaoStart) { setFormError('Data de início da captação é obrigatória'); return false; }
    if (!form.captacaoEnd) { setFormError('Data de fim da captação é obrigatória'); return false; }
    if (!form.liveDate) { setFormError('Data da aula ao vivo é obrigatória'); return false; }
    if (!form.liveTime) { setFormError('Horário da aula ao vivo é obrigatório'); return false; }
    if (!form.instructorName.trim()) { setFormError('Nome do instrutor é obrigatório'); return false; }
    if (!form.instructorBio.trim()) { setFormError('Bio do instrutor é obrigatória'); return false; }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: LaunchFormData = {
      ...form,
      originalPrice: form.originalPrice && form.originalPrice > 0 ? form.originalPrice : undefined,
      guarantee: form.guarantee?.trim() || undefined,
      metaCampaignId: form.metaCampaignId?.trim() || undefined,
    };

    try {
      if (isEditing && id) {
        await updateLaunch(id, data);
        navigate(`/launches/${id}/creative`);
      } else {
        const launch = await createLaunch(data);
        navigate(`/launches/${launch.id}/creative`);
      }
    } catch {
      // error already in store
    }
  };

  return (
    <div className="page">
      <PageHeader
        title={isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}
        subtitle={isEditing ? 'Atualize as informações do seu lançamento' : 'Preencha as informações do seu lançamento'}
        actions={
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        }
      />

      {(error || formError) && (
        <div className="alert alert--error">{formError ?? error}</div>
      )}

      <form onSubmit={handleSubmit} className="launch-form">
        {/* Informações Básicas */}
        <Card title="Informações Básicas" className="form-section">
          <div className="form-grid">
            <Input
              label="Nome do Curso"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Investimentos para Iniciantes"
              required
            />
            <Input
              label="Nome do Instrutor"
              name="instructorName"
              value={form.instructorName}
              onChange={handleChange}
              placeholder="Ex: Diogo Spolador"
              required
            />
          </div>

          <Textarea
            label="Descrição do Curso"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descreva o que os alunos vão aprender..."
            rows={4}
            required
          />

          <Textarea
            label="Bio do Instrutor"
            name="instructorBio"
            value={form.instructorBio}
            onChange={handleChange}
            placeholder="Experiência, resultados, credenciais do instrutor..."
            rows={3}
            required
          />
        </Card>

        {/* Audiência e Posicionamento */}
        <Card title="Audiência e Posicionamento" className="form-section">
          <Textarea
            label="Público-alvo"
            name="targetAudience"
            value={form.targetAudience}
            onChange={handleChange}
            placeholder="Ex: Pessoas entre 25-45 anos que querem aprender a investir do zero..."
            rows={3}
            required
          />
          <Textarea
            label="Proposta Única de Valor (USP)"
            name="usp"
            value={form.usp}
            onChange={handleChange}
            placeholder="O que torna este curso único? Qual a promessa principal?"
            rows={3}
            required
            hint="Esta é a proposta central que será usada em todos os copies gerados"
          />
        </Card>

        {/* Datas */}
        <Card title="Datas e Plataforma" className="form-section">
          <div className="form-grid form-grid--3">
            <Input
              label="Início da Captação"
              name="captacaoStart"
              type="date"
              value={form.captacaoStart}
              onChange={handleChange}
              required
            />
            <Input
              label="Fim da Captação"
              name="captacaoEnd"
              type="date"
              value={form.captacaoEnd}
              onChange={handleChange}
              required
            />
            <Input
              label="Data da Aula ao Vivo"
              name="liveDate"
              type="date"
              value={form.liveDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <Input
              label="Horário da Aula ao Vivo"
              name="liveTime"
              type="time"
              value={form.liveTime}
              onChange={handleChange}
              required
            />
            <Select
              label="Plataforma"
              name="livePlatform"
              value={form.livePlatform}
              onChange={handleChange}
              options={PLATFORM_OPTIONS}
              required
            />
          </div>
        </Card>

        {/* Precificação */}
        <Card title="Precificação" className="form-section">
          <div className="form-grid">
            <Input
              label="Preço (R$)"
              name="price"
              type="number"
              value={form.price || ''}
              onChange={handleChange}
              placeholder="297.00"
              min="0"
              step="0.01"
              required
            />
            <Input
              label="Preço Original (R$)"
              name="originalPrice"
              type="number"
              value={form.originalPrice ?? ''}
              onChange={handleChange}
              placeholder="497.00"
              min="0"
              step="0.01"
              hint="Opcional: preço riscado para mostrar desconto"
            />
          </div>

          <Textarea
            label="Garantia"
            name="guarantee"
            value={form.guarantee ?? ''}
            onChange={handleChange}
            placeholder="Ex: Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do seu dinheiro."
            rows={2}
            hint="Opcional"
          />
        </Card>

        {/* Bônus */}
        <Card title="Bônus" className="form-section">
          <div className="bonus-input-row">
            <Input
              label="Adicionar Bônus"
              value={bonusInput}
              onChange={(e) => setBonusInput(e.target.value)}
              placeholder="Ex: Planilha de controle financeiro"
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addBonus(); }
              }}
            />
            <Button type="button" variant="secondary" onClick={addBonus} className="bonus-add-btn">
              Adicionar
            </Button>
          </div>

          {form.bonuses.length > 0 && (
            <ul className="bonus-list">
              {form.bonuses.map((bonus, index) => (
                <li key={index} className="bonus-item">
                  <span className="bonus-item-icon">🎁</span>
                  <span className="bonus-item-text">{bonus}</span>
                  <button
                    type="button"
                    className="bonus-remove-btn"
                    onClick={() => removeBonus(index)}
                    aria-label="Remover bônus"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Meta Ads */}
        <Card title="Integração Meta Ads" className="form-section">
          <Input
            label="ID da Campanha no Meta"
            name="metaCampaignId"
            value={form.metaCampaignId ?? ''}
            onChange={handleChange}
            placeholder="Ex: 120218543210987654"
            hint="Opcional: vincule uma campanha para visualizar métricas no Dashboard"
          />
        </Card>

        <div className="form-submit">
          <Button type="submit" loading={loading} size="lg">
            {isEditing ? 'Salvar Alterações' : 'Criar Lançamento'}
          </Button>
        </div>
      </form>
    </div>
  );
}
