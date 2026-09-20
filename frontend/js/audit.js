import { submitAutomationAudit } from './api.js';

const form = document.getElementById('audit-form');
const formSection = document.querySelector('.audit-section');
const loading = document.getElementById('audit-loading');
const result = document.getElementById('audit-result');

const number = (id) => Math.max(0, Number(document.getElementById(id).value) || 0);

function updateCalculator() {
  const employees = number('employees');
  const hours = number('repetitiveHours');
  const cost = number('hourlyCost');
  const yearly = Math.round(Math.min(hours, employees * 40) * cost * 52 * 0.45);
  document.getElementById('calculator-result').textContent = new Intl.NumberFormat('en-IE', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(yearly);
  document.getElementById('calculator-caption').textContent = yearly
    ? 'Estimated yearly saving if approximately 45% of repetitive work is automated.'
    : 'Enter your team size, hourly cost and repetitive hours to calculate an estimate.';
}

function validate() {
  const required = ['businessType', 'employees', 'biggestProblem', 'email'];
  let valid = true;
  required.forEach((id) => {
    const input = document.getElementById(id);
    const error = document.getElementById(`error-${id}`);
    const invalidEmail = id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (!input.value.trim() || invalidEmail) {
      input.setAttribute('aria-invalid', 'true');
      if (error) error.textContent = id === 'email' ? 'Enter a valid email address.' : 'This field is required.';
      valid = false;
    } else {
      input.removeAttribute('aria-invalid');
      if (error) error.textContent = '';
    }
  });
  return valid;
}

function buildMockAudit(data) {
  const workload = data.repetitiveHours * 4 + data.messagesPerDay * 0.35 + data.leadsPerMonth * 0.12;
  const score = Math.min(96, Math.max(42, Math.round(42 + workload * 0.55)));
  const leadHours = Math.max(3, Math.round(data.leadsPerMonth * 0.1));
  const supportHours = Math.max(4, Math.round(data.messagesPerDay * 0.45));
  return {
    automationScore: score,
    summary: `Your ${data.businessType.toLowerCase()} has strong potential to reduce manual work with a few connected automations.`,
    opportunities: [
      { name: 'Lead qualification', priority: data.leadsPerMonth > 30 ? 'high' : 'medium', estimatedHoursSaved: leadHours, difficulty: 'medium', description: 'Capture new inquiries, identify the right service and route qualified leads to your team without manual data entry.' },
      { name: 'Customer communication', priority: data.messagesPerDay > 15 ? 'high' : 'medium', estimatedHoursSaved: supportHours, difficulty: 'medium', description: 'Handle common questions instantly, collect missing details and escalate exceptions to a person.' },
      { name: 'Operations workflow', priority: 'medium', estimatedHoursSaved: Math.max(3, Math.round(data.repetitiveHours * 4 * 0.3)), difficulty: 'low', description: 'Connect your existing tools so updates, reminders and reports happen automatically.' },
    ],
    recommendedStack: ['n8n', 'AI Agent', data.crm || 'CRM', 'Google Workspace'],
    nextStep: 'Book a free consultation to validate the highest-priority workflow and map the implementation.',
  };
}

function setStages() {
  document.querySelectorAll('[data-stage]').forEach((item, index) => {
    window.setTimeout(() => {
      item.className = `checklist-item ${index < 3 ? 'done' : 'active'}`;
      item.querySelector('.status-icon').textContent = index < 3 ? '✓' : '●';
    }, index * 550);
  });
}

function renderAudit(audit) {
  const score = Math.max(0, Math.min(100, Number(audit.automationScore) || 0));
  document.getElementById('score-value').textContent = score;
  document.getElementById('audit-summary').textContent = audit.summary || 'Your business has meaningful automation potential.';
  document.getElementById('audit-next-step').textContent = audit.nextStep || 'Book a free consultation to plan the next step.';
  document.getElementById('score-ring').style.strokeDashoffset = String(326.7 * (1 - score / 100));
  const priorityClass = { high: 'badge-priority-high', medium: 'badge-priority-medium', low: 'badge-priority-low' };
  document.getElementById('opportunities').innerHTML = (audit.opportunities || []).map((opportunity) => `
    <article class="card opportunity-card">
      <div class="opportunity-meta"><span class="badge ${priorityClass[opportunity.priority] || 'badge-cold'}">${opportunity.priority || 'medium'} priority</span><span class="badge badge-cold">${opportunity.difficulty || 'medium'} effort</span></div>
      <h3>${opportunity.name || 'Automation opportunity'}</h3><p>${opportunity.description || ''}</p>
      <span class="opportunity-hours">Estimated ${opportunity.estimatedHoursSaved || 0} hours/month saved</span>
    </article>`).join('');
  document.getElementById('recommended-stack').innerHTML = (audit.recommendedStack || []).map((tool) => `<span>${tool}</span>`).join('');
}

if (form) {
  ['employees', 'repetitiveHours', 'hourlyCost'].forEach((id) => document.getElementById(id).addEventListener('input', updateCalculator));
  updateCalculator();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.getElementById('audit-status');
    if (!validate()) { status.className = 'form-status error'; status.textContent = 'Please complete the required fields.'; return; }
    const data = Object.fromEntries(new FormData(form));
    const payload = { ...data, employees: number('employees'), leadsPerMonth: number('leadsPerMonth'), messagesPerDay: number('messagesPerDay'), repetitiveHours: number('repetitiveHours'), tools: data.tools.split(',').map((item) => item.trim()).filter(Boolean) };
    formSection.hidden = true; loading.hidden = false; setStages();
    try {
      let audit;
      try { audit = await submitAutomationAudit(payload); } catch (_) { audit = buildMockAudit(payload); }
      await new Promise((resolve) => window.setTimeout(resolve, 1800));
      renderAudit(audit.data || audit);
      loading.hidden = true; result.hidden = false; result.focus();
    } catch (_) {
      loading.hidden = true; formSection.hidden = false;
      status.className = 'form-status error'; status.textContent = 'Something went wrong. Please try again or contact us directly.';
    }
  });
}

document.getElementById('restart-audit')?.addEventListener('click', () => {
  result.hidden = true; formSection.hidden = false; formSection.scrollIntoView({ behavior: 'smooth' });
});
