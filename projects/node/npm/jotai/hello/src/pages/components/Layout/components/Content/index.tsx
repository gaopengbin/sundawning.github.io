import { Layout } from 'antd';
import { useAtom } from 'jotai';
import {
  search_keyword_atom,
  search_keywords_atom,
} from '../Header/components/Search';
const { Content } = Layout;
export default function IndexPage() {
  const [search_keyword_atom_value] = useAtom(search_keyword_atom);
  const [search_keywords_atom_value] = useAtom(search_keywords_atom);
  return (
    <Content style={{ minHeight: '480px' }}>
      搜索的关键字：{search_keyword_atom_value}{' '}
      所有搜索的关键字Atom，在localStorage里存储。
      {JSON.stringify(search_keywords_atom_value)}
    </Content>
  );
}
