# Site de teste · IOA/ITC São Luís

Protótipo acadêmico em HTML, CSS e JavaScript puros. Sem frameworks, build ou backend. O conteúdo está sujeito a validação pela instituição.

## Como rodar
- Abra `index.html` direto no navegador (funciona em `file://`), ou
- No VS Code, use a extensão **Live Server** e clique em "Go Live".

Painel simulado: `admin.html` (sem login, `noindex`). Fica só no seu computador: está no `.gitignore` e não vai para o deploy.

## Estrutura
```
*.html           11 páginas (especializacao.html lê ?slug=)
css/             tokens · base · components · pages
js/config.js     contatos oficiais, flags e tabela de qualificação
js/data.js       especializações, fotos, textos oficiais, serviços da clínica
js/layout.js     header, menu mobile, rodapé, barra de ações, link "Portal do aluno"
js/ui.js         utilitários (modal, foco preso, ícones, animações)
js/catalog.js · course.js · gallery.js · forms.js · chatbot.js · admin.js · home.js · pages.js
portal.html      página "em breve" do portal do aluno (login desabilitado, sem lógica)
assets/img/      fotos e logo
```
Os scripts são clássicos, sem `import`/`export`, e compartilham o objeto global `IOA`. Por isso o site abre sem servidor.

## O que é simulado
| Recurso | Simulação | Chave em `localStorage` |
|---|---|---|
| Leads dos formulários | salvos no navegador, atraso de ~1 s | `ioa_leads` |
| CMS de especializações | painel edita e substitui `data.js` | `ioa_courses` |
| Galeria (ordem/legendas) | painel | `ioa_photos` |
| Erro de envio / catálogo vazio | alternadores do painel | `ioa_force_error`, `ioa_demo_empty` |
| Histórico do chatbot | por sessão | `ioa_chat` (sessionStorage) |

Nenhum dado sai do navegador. **O WhatsApp em `config.js` é real**: para testar, troque por um número seu.

## Como trocar por backend real
- `forms.js` → em `saveLead()`, trocar o `localStorage` por `fetch('/api/leads', { method: 'POST', ... })` e tratar o erro no mesmo fluxo que hoje é simulado.
- `data.js` → `IOA.getCourses()` e `IOA.getPhotos()` passam a ler de uma API/CMS.
- `admin.js` → substituir pelo CRM/CMS. Esse painel não deve ir para produção.
- Ajustar os pesos de qualificação em `IOA.QUAL` (`config.js`) com o comercial.

## Pendências de conteúdo (a confirmar com a instituição)
- Valores, turmas, carga horária e programa: hoje aparecem como "Consulte a equipe".
- Autorização para exibir docentes (`CFG.mostrarDocentes`) e a coordenação, hoje com o selo "sujeito a autorização".
- Vigência das 6 especializações (divulgadas em 12/2025).
- Textos de missão e visão, política de privacidade jurídica, encarregado (DPO), razão social e CNPJ, e-mail.
- Domínio definitivo: substituir `DOMINIO-A-DEFINIR` em `sitemap.xml`/`robots.txt` e tornar absolutas as URLs de `og:image`.
- Aprovação de uso da marca IOA/ITC antes de qualquer publicação.
