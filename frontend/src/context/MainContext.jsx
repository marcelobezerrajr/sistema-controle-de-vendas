import React from 'react';
import { ClienteProvider } from './ClienteContext';
import { ComissaoProvider } from './ComissaoContext';
import { CustoProvider } from './CustoContext';
import { FornecedorProvider } from './FornecedorContext';
import { ItemVendaProvider } from './ItemVendaContext';
import { ParcelaProvider } from './ParcelaContext';
import { ProdutoProvider } from './ProdutoContext';
import { VendaProvider } from './VendaContext';
import { VendaVendedorProvider } from './VendaVendedorContext';
import { VendedorProvider } from './VendedorContext';
import { LoginProvider } from './LoginContext';

const MainProvider = ({ children }) => {
  return (
    <LoginProvider>
      <ClienteProvider>
        <ComissaoProvider>
          <CustoProvider>
            <ItemVendaProvider>
              <ParcelaProvider>
                <ProdutoProvider>
                  <VendedorProvider>
                    <VendaProvider>
                      <VendaVendedorProvider>
                        <FornecedorProvider>
                          {children}
                        </FornecedorProvider>
                      </VendaVendedorProvider>
                    </VendaProvider>
                  </VendedorProvider>
                </ProdutoProvider>
              </ParcelaProvider>
            </ItemVendaProvider>
          </CustoProvider>
        </ComissaoProvider>
      </ClienteProvider>
    </LoginProvider>
  );
};

export { MainProvider };
