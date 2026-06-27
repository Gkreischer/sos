const tourSteps = [
  {
    stepId: 'inicio',
    anchorId: 'menu.start',
    content: 'Este tour irá demonstrar as funcionalidades básicas do sistema.',
    title: 'Bem-vindo(a)!',
  },
  {
    anchorId: 'menu.list',
    content:
      'Aqui você pode acessar as principais funcionalidades do programa.',
    title: 'Menu',
  },
  {
    anchorId: 'menu.categories',
    content:
      'Primeiro crie categorias para o sistema. Por exemplo: desktop, notebook, nobreak ou qualquer outra que você queira usar.',
    title: 'Categorias',
    route: '/categorias',
  },
  {
    anchorId: 'menu.equipments',
    content: 'Aqui você cadastra os equipamentos dos seus clientes',
    title: 'Equipamentos',
    route: '/equipamentos',
  },
  {
    anchorId: 'menu.parts',
    content: 'Aqui você cadastra materiais para suas ordens de serviço',
    title: 'Materiais',
    route: '/materiais',
  },
  {
    anchorId: 'menu.os',
    content: 'Aqui você cadastra e gerencia suas ordens de serviço',
    title: 'Ordens de serviço',
    route: '/ordem-servico',
  },
  {
    anchorId: 'menu.chat',
    content: 'Aqui você se comunica com sua empresa',
    title: 'Chat',
    route: '/chat',
  },
  {
    anchorId: 'menu.users',
    content: 'Aqui você cadastra utilizadores do sistema e também clientes',
    title: 'Usuários e clientes',
    route: '/usuarios',
  },
  {
    anchorId: 'menu.metrics',
    content: 'Aqui você verifica indicadores do seu negócio',
    title: 'Métricas do seu negócio',
    route: '/relatorios',
  },
  {
    anchorId: 'menu.settings',
    content: 'Aqui você gerencia seus dados do usuário e do seu negócio',
    title: 'Configurações do seu usuário e negócio',
    route: '/configuracoes',
  },
  {
    anchorId: 'os.add-button',
    content: 'Para criar uma nova ordem de serviço, basta clicar aqui',
    title: 'Criar Ordem de Serviço',
    route: '/ordem-servico',
  },
].map((step) => ({
  ...step,
  nextBtnTitle: 'Avançar',
  prevBtnTitle: 'Voltar',
  enableBackdrop: true,
  endBtnTitle: 'Sair',
}));

export default tourSteps;
