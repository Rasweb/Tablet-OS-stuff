export const navigation = $state({
  view: 'home',
  previousView: 'home'
});

export function go(viewName: string) {
  navigation.previousView = navigation.view;
  navigation.view = viewName;
}