import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Chain from "../../components/chain";
import { generateChainData } from "../../utils/fetch";
import { isTestnet } from "../../utils";

export async function getStaticProps() {
  const sortedChains = await generateChainData();

  return {
    props: {
      chains: sortedChains,
      // messages: (await import(`../../translations/${locale}.json`)).default,
    }
  };
}

function Home({ chains }) {
  const [chainName, setChainName] = React.useState("");

  const router = useRouter();
  const { testnets, testnet, search } = router.query;

  const chainToFilter = React.useMemo(() => {
    if (search?.length > 0 && chainName.length === 0) {
      return typeof search === "string" ? search : search[0];
    }
    return chainName;
  }, [search, chainName]);

  const includeTestnets = React.useMemo(() => {
    return (testnets === "true" || testnet === "true");
  }, [testnets, testnet]);

  const filteredChains = React.useMemo(() => {
    if (!chains?.length) return [];

    const normalized = chainToFilter?.toLowerCase() ?? "";
    const hasFilter = normalized.length > 0;

    return chains.filter((chain) => {
      if (!includeTestnets && isTestnet(chain)) return false;

      if (hasFilter) {
        return (
          chain.chain.toLowerCase().includes(normalized) ||
          chain.chainId.toString().includes(normalized) ||
          chain.name.toLowerCase().includes(normalized) ||
          (chain.nativeCurrency?.symbol ?? "").toLowerCase().includes(normalized)
        );
      }

      return true;
    });
  }, [chains, includeTestnets, chainToFilter]);

  return (
    <>
      <Head>
        <title>ChainList</title>
        <meta
          name="description"
          content="ChainList is a list of RPCs for EVM(Ethereum Virtual Machine) networks. Use the information to connect your wallets and Web3 middleware providers to the appropriate Chain ID and Network ID. Find the best RPC for both Mainnet and Testnet to connect to the correct chain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout lang="zh" chainName={chainName} setChainName={setChainName}>
        <React.Suspense fallback={<div className="h-screen"></div>}>
          <div className="grid gap-5 grid-cols-1 place-content-between pb-4 sm:pb-10 sm:grid-cols-[repeat(auto-fit,_calc(50%_-_15px))] 3xl:grid-cols-[repeat(auto-fit,_calc(33%_-_20px))] isolate grid-flow-dense">
            {filteredChains.map((chain) => (
              <Chain chain={chain} key={chain.chainId + "zh"} lang="zh" />
            ))}
          </div>
        </React.Suspense>
      </Layout>
    </>
  );
}

export default Home;
