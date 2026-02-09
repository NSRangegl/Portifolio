import pandas as pd
import numpy as np

np.random.seed(42)

# =========================================================
# 1. TAB_Vendedors.csv
# =========================================================
vendedores = [
    (1000,"Carlos Almeida",1015,"Mariana Costa"),
    (1001,"Bruno Santos",1015,"Mariana Costa"),
    (1002,"Rafael Pereira",1015,"Mariana Costa"),
    (1003,"Diego Rocha",1015,"Mariana Costa"),
    (1004,"Lucas Martins",1015,"Mariana Costa"),
    (1005,"Felipe Araujo",1016,"Ricardo Nogueira"),
    (1006,"Thiago Lima",1016,"Ricardo Nogueira"),
    (1007,"André Pacheco",1016,"Ricardo Nogueira"),
    (1008,"Eduardo Farias",1016,"Ricardo Nogueira"),
    (1009,"Renato Barros",1016,"Ricardo Nogueira"),
    (1010,"Gustavo Teixeira",1017,"Patricia Menezes"),
    (1011,"Henrique Lopes",1017,"Patricia Menezes"),
    (1012,"Igor Batista",1017,"Patricia Menezes"),
    (1013,"Marcelo Guedes",1017,"Patricia Menezes"),
    (1014,"Victor Rangel",1017,"Patricia Menezes"),
    (1015,"Mariana Costa","",""),
    (1016,"Ricardo Nogueira","",""),
    (1017,"Patricia Menezes","","")
]

df_vendedores = pd.DataFrame(
    vendedores,
    columns=["ID_vendedor","Nome_vendedor","ID_gerente","Nome_gerente"]
)

df_vendedores.to_csv("TAB_Vendedors.csv", index=False, encoding="utf-8")


# =========================================================
# 2. TAB_Produtos.csv
# =========================================================
produtos = []
prod_id = 2000

def add_prod(nome, valor, margem):
    global prod_id
    produtos.append((prod_id, nome, f"{valor:.2f}", f"{margem:.2f}"))
    prod_id += 1

# Mouses (10)
add_prod("Mouse Gamer Logitech G502 HERO",399.90,0.35)
add_prod("Mouse Logitech M185 Wireless",79.90,0.55)
add_prod("Mouse Razer DeathAdder Essential",249.90,0.38)
add_prod("Mouse HyperX Pulsefire Core",199.90,0.40)
add_prod("Mouse Gamer Redragon Cobra",129.90,0.60)
add_prod("Mouse Logitech MX Master 3S",799.90,0.30)
add_prod("Mouse Razer Basilisk V3",499.90,0.34)
add_prod("Mouse Multilaser MO251",59.90,0.65)
add_prod("Mouse Gamer Fortrek Spider",89.90,0.62)
add_prod("Mouse Logitech G203 Lightsync",169.90,0.45)

# Teclados (8)
add_prod("Teclado Mecânico Logitech G Pro",899.90,0.32)
add_prod("Teclado Logitech K120",99.90,0.60)
add_prod("Teclado Mecânico Razer BlackWidow V3",1099.90,0.28)
add_prod("Teclado HyperX Alloy FPS Pro",699.90,0.35)
add_prod("Teclado Gamer Redragon Kumara",279.90,0.50)
add_prod("Teclado Logitech MX Keys",699.90,0.34)
add_prod("Teclado Gamer Fortrek Black Hawk",199.90,0.55)
add_prod("Teclado Multilaser Slim TC193",89.90,0.65)

# Headsets (6)
add_prod("Headset Gamer Logitech G733",799.90,0.33)
add_prod("Headset Razer Kraken X",349.90,0.42)
add_prod("Headset HyperX Cloud II",899.90,0.30)
add_prod("Headset Gamer Redragon Zeus",399.90,0.45)
add_prod("Headset Multilaser Warrior",199.90,0.55)
add_prod("Headset Logitech H390 USB",249.90,0.48)

# Webcams (4)
add_prod("Webcam Logitech C920 HD Pro",699.90,0.36)
add_prod("Webcam Logitech C270",299.90,0.45)
add_prod("Webcam Razer Kiyo",899.90,0.32)
add_prod("Webcam Multilaser WC050",149.90,0.58)

# Monitores (2)
add_prod("Monitor Gamer LG Ultragear 27''",2499.90,0.25)
add_prod("Monitor Dell P2422H 24''",1799.90,0.28)

df_produtos = pd.DataFrame(
    produtos,
    columns=["ID_produto","Nome_produto","Valor_produto","PNG_produto"]
)

df_produtos.to_csv("TAB_Produtos.csv", index=False, encoding="utf-8")


# =========================================================
# 3. TAB_Meta.csv
# =========================================================
ativos = df_vendedores[df_vendedores["ID_vendedor"] <= 1014]
meses = pd.date_range("2025-01-01", "2026-01-01", freq="MS")

metas = []

for _, vendedor in ativos.iterrows():
    base = np.random.uniform(15000, 25000)
    crescimento = np.random.uniform(0.03, 0.05)
    valor = base

    for mes in meses:
        fator = 1.3 if mes.month in [11, 12] else 1.0
        metas.append((
            vendedor.ID_vendedor,
            vendedor.Nome_vendedor,
            mes.strftime("%d/%m/%Y"),
            f"{valor * fator:.2f}"
        ))
        valor *= (1 + crescimento)

df_meta = pd.DataFrame(
    metas,
    columns=["ID_vendedor","Nome_vendedor","Data_meta","Valor_meta"]
)

df_meta.to_csv("TAB_Meta.csv", index=False, encoding="utf-8")


# =========================================================
# 4. TAB_Vendas.csv
# =========================================================
datas = pd.date_range("2025-01-01", "2026-01-31", freq="D")

feriados = {
    "01/01/2025","21/04/2025","01/05/2025","07/09/2025",
    "12/10/2025","02/11/2025","15/11/2025","25/12/2025",
    "01/01/2026"
}

black_friday = "28/11/2025"

pesos = []
for d in datas:
    w = 1.0
    if d.month == 11: w *= 1.35
    if d.month == 12: w *= 1.45
    if d.weekday() == 5: w *= 1.30
    if d.weekday() == 6: w *= 1.20
    if d.strftime("%d/%m/%Y") in feriados: w *= 0.5
    if d.strftime("%d/%m/%Y") == black_friday: w *= 3.0
    pesos.append(w)

pesos = np.array(pesos) / np.sum(pesos)

datas_venda = np.random.choice(datas, size=3250, p=pesos)

top_vendedores = ativos.sample(3, random_state=1)["ID_vendedor"].tolist()

regioes = ["Sudeste","Sul","Nordeste","Centro-Oeste","Norte"]
reg_pesos = [0.45,0.25,0.15,0.10,0.05]

vendas = []

for i, data in enumerate(sorted(datas_venda)):
    vendedor_id = (
        np.random.choice(top_vendedores)
        if np.random.rand() < 0.4
        else np.random.choice(ativos["ID_vendedor"])
    )

    vendedor = ativos[ativos.ID_vendedor == vendedor_id].iloc[0]
    produto = df_produtos.sample(1).iloc[0]

    valor_prod = float(produto.Valor_produto)
    quantidade = np.random.randint(1,4)
    if valor_prod < 100 and np.random.rand() < 0.05:
        quantidade = np.random.randint(4,6)

    vendas.append((
        i+1,
        str(i+1).zfill(6),
        vendedor_id,
        vendedor.Nome_vendedor,
        produto.ID_produto,
        produto.Nome_produto,
        f"{valor_prod:.2f}",
        quantidade,
        f"{valor_prod * quantidade:.2f}",
        pd.Timestamp(data).strftime("%d/%m/%Y"),
        np.random.choice(regioes, p=reg_pesos)
    ))

df_vendas = pd.DataFrame(
    vendas,
    columns=[
        "ID_venda","NFe","ID_vendedor","Nome_vendedor",
        "ID_produto","Nome_produto","Valor_produto",
        "Quant_Produto","Valor_venda","Data_venda","Regiao_venda"
    ]
)

df_vendas.to_csv("TAB_Vendas.csv", index=False, encoding="utf-8")

print("✅ Arquivos CSV gerados com sucesso.")
